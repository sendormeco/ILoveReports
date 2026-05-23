"""Backward-compatible import for the DOCX exporter plugin."""

from backend.plugins.exporters.docx import DocxExporter


class DocxDocumentExporter(DocxExporter):
    pass
