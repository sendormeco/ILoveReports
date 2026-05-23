from __future__ import annotations

from backend.application.plugin_registry import PluginRegistry
from backend.application.prompt_builder import ReportPromptBuilder
from backend.domain.models import DocxRequest, GeneratedReport, ReportRequest
from backend.plugins.base import ExportedDocument


class ReportService:
    """Application service that orchestrates report generation and export.

    The service receives dependencies through the constructor. It does not know
    which concrete LLM or document library is used; it only asks PluginRegistry
    for the selected strategy.
    """

    def __init__(
        self,
        registry: PluginRegistry,
        prompt_builder: ReportPromptBuilder | None = None,
        default_generator: str = "ollama",
        default_exporter: str = "docx",
    ) -> None:
        self.registry = registry
        self.prompt_builder = prompt_builder or ReportPromptBuilder()
        self.default_generator = default_generator
        self.default_exporter = default_exporter

    def generate_report(self, data: ReportRequest) -> GeneratedReport:
        generator_name = data.generator or self.default_generator
        generator = self.registry.get_generator(generator_name)
        prompt = self.prompt_builder.build(data)
        text = generator.generate(prompt).strip()
        if not text:
            text = "Генератор текста вернул пустой ответ. Проверьте модель или входные данные."
        return GeneratedReport(report=text, generator=generator.name)

    def export_report(self, payload: DocxRequest, exporter_name: str | None = None) -> ExportedDocument:
        selected_exporter = exporter_name or payload.exporter or self.default_exporter
        exporter = self.registry.get_exporter(selected_exporter)
        return exporter.export(payload)
