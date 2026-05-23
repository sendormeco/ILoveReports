from io import BytesIO
from urllib.parse import quote

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from backend.application.dependencies import ApplicationContainer
from backend.domain.models import DocxRequest, ReportRequest
from backend.plugins.base import ExportedDocument


def _download_response(document: ExportedDocument) -> StreamingResponse:
    encoded_filename = quote(document.filename)
    headers = {"Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"}
    return StreamingResponse(BytesIO(document.content), media_type=document.media_type, headers=headers)


def create_router(container: ApplicationContainer | None = None) -> APIRouter:
    router = APIRouter()
    app_container = container or ApplicationContainer()

    @router.get("/")
    def root():
        return {
            "status": "ILoveReports backend is running",
            "text_generator": app_container.settings.text_generator,
            "document_exporter": app_container.settings.document_exporter,
            "architecture": "multi-class plugin architecture",
        }

    @router.get("/health")
    def health():
        return {
            "status": "ok",
            "text_generator": app_container.settings.text_generator,
            "document_exporter": app_container.settings.document_exporter,
            "ollama_model": app_container.settings.ollama_model,
        }

    @router.get("/plugins")
    def list_plugins():
        return app_container.plugin_registry().catalog()

    @router.post("/generate")
    def generate_report(payload: ReportRequest):
        try:
            return app_container.generate_report_use_case().execute(payload)
        except KeyError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        except RuntimeError as exc:
            raise HTTPException(status_code=502, detail=str(exc)) from exc

    @router.post("/generate-docx")
    def generate_docx(payload: DocxRequest):
        try:
            document = app_container.generate_docx_use_case().execute(payload)
        except KeyError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        except RuntimeError as exc:
            raise HTTPException(status_code=500, detail=str(exc)) from exc
        return _download_response(document)

    @router.post("/export/{exporter_name}")
    def export_report(exporter_name: str, payload: DocxRequest):
        try:
            document = app_container.export_report_use_case().execute(payload, exporter_name=exporter_name)
        except KeyError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        except RuntimeError as exc:
            raise HTTPException(status_code=500, detail=str(exc)) from exc
        return _download_response(document)

    return router
