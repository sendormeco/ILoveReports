from dataclasses import dataclass
import os

from backend.application.plugin_registry import PluginRegistry
from backend.application.report_service import ReportService
from backend.application.use_cases import ExportReportUseCase, GenerateDocxUseCase, GenerateReportUseCase
from backend.plugins.exporters.docx import DocxExporter
from backend.plugins.exporters.markdown import MarkdownExporter
from backend.plugins.generators.huggingface import HuggingFaceGenerator
from backend.plugins.generators.ollama import OllamaGenerator
from backend.plugins.generators.static import MockGenerator, StaticGenerator


@dataclass(frozen=True)
class ApplicationSettings:
    """Runtime settings for wiring application dependencies and plugins."""

    text_generator: str = "ollama"
    document_exporter: str = "docx"
    ollama_bin: str = "ollama"
    ollama_model: str = "llama3"
    ollama_timeout_seconds: int = 300
    huggingface_model: str = "t5-small"

    @classmethod
    def from_env(cls) -> "ApplicationSettings":
        return cls(
            text_generator=os.getenv("TEXT_GENERATOR", "ollama").lower().strip(),
            document_exporter=os.getenv("DOCUMENT_EXPORTER", "docx").lower().strip(),
            ollama_bin=os.getenv("OLLAMA_BIN", "ollama"),
            ollama_model=os.getenv("OLLAMA_MODEL", "llama3"),
            ollama_timeout_seconds=int(os.getenv("OLLAMA_TIMEOUT_SECONDS", "300")),
            huggingface_model=os.getenv("HUGGINGFACE_MODEL", "t5-small"),
        )


class ApplicationContainer:
    """Dependency Injection container for use cases, services and plugins."""

    def __init__(self, settings: ApplicationSettings | None = None) -> None:
        self.settings = settings or ApplicationSettings.from_env()
        self._registry: PluginRegistry | None = None
        self._report_service: ReportService | None = None
        self._generate_report_use_case: GenerateReportUseCase | None = None
        self._export_report_use_case: ExportReportUseCase | None = None
        self._generate_docx_use_case: GenerateDocxUseCase | None = None

    def plugin_registry(self) -> PluginRegistry:
        if self._registry is None:
            registry = PluginRegistry()
            registry.register_generator(StaticGenerator())
            registry.register_generator(MockGenerator())
            registry.register_generator(
                OllamaGenerator(
                    ollama_bin=self.settings.ollama_bin,
                    model=self.settings.ollama_model,
                    timeout_seconds=self.settings.ollama_timeout_seconds,
                )
            )
            registry.register_generator(HuggingFaceGenerator(model_name=self.settings.huggingface_model))
            registry.register_exporter(DocxExporter())
            registry.register_exporter(MarkdownExporter())
            self._registry = registry
        return self._registry

    def report_service(self) -> ReportService:
        if self._report_service is None:
            self._report_service = ReportService(
                registry=self.plugin_registry(),
                default_generator=self.settings.text_generator,
                default_exporter=self.settings.document_exporter,
            )
        return self._report_service

    def generate_report_use_case(self) -> GenerateReportUseCase:
        if self._generate_report_use_case is None:
            self._generate_report_use_case = GenerateReportUseCase(self.report_service())
        return self._generate_report_use_case

    def export_report_use_case(self) -> ExportReportUseCase:
        if self._export_report_use_case is None:
            self._export_report_use_case = ExportReportUseCase(self.report_service())
        return self._export_report_use_case

    def generate_docx_use_case(self) -> GenerateDocxUseCase:
        if self._generate_docx_use_case is None:
            self._generate_docx_use_case = GenerateDocxUseCase(self.report_service())
        return self._generate_docx_use_case
