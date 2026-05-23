from backend.domain.models import DocxRequest
from backend.plugins.base import AbstractExporter, ExportedDocument


class MarkdownExporter(AbstractExporter):
    """Exporter plugin that creates a lightweight Markdown report."""

    @property
    def name(self) -> str:
        return "markdown"

    @property
    def file_extension(self) -> str:
        return ".md"

    @property
    def media_type(self) -> str:
        return "text/markdown; charset=utf-8"

    def export(self, payload: DocxRequest) -> ExportedDocument:
        content = (
            f"# {payload.title}\n\n"
            f"**Автор:** {payload.author}  \n"
            f"**Организация:** {payload.organization}  \n"
            f"**Дата:** {payload.date}  \n"
            + (f"**Руководитель:** {payload.supervisor}  \n" if payload.supervisor else "")
            + "\n---\n\n"
            + payload.report
            + "\n"
        ).encode("utf-8")
        return ExportedDocument(
            content=content,
            filename=AbstractExporter.safe_filename(payload.title, self.file_extension),
            media_type=self.media_type,
            file_extension=self.file_extension,
        )
