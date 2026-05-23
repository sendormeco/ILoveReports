from backend.application.report_service import ReportService
from backend.domain.models import DocxRequest, GeneratedReport, ReportRequest
from backend.plugins.base import ExportedDocument


class GenerateReportUseCase:
    """Business scenario for generating a report text."""

    def __init__(self, report_service: ReportService) -> None:
        self.report_service = report_service

    def execute(self, data: ReportRequest) -> GeneratedReport:
        return self.report_service.generate_report(data)


class ExportReportUseCase:
    """Business scenario for exporting a generated report through an exporter plugin."""

    def __init__(self, report_service: ReportService) -> None:
        self.report_service = report_service

    def execute(self, payload: DocxRequest, exporter_name: str | None = None) -> ExportedDocument:
        return self.report_service.export_report(payload, exporter_name=exporter_name)


class GenerateDocxUseCase(ExportReportUseCase):
    """Backward-compatible scenario for exporting a generated report to DOCX."""

    def execute(self, payload: DocxRequest, exporter_name: str | None = "docx") -> ExportedDocument:
        return super().execute(payload, exporter_name=exporter_name)
