from __future__ import annotations

from backend.domain.models import PluginCatalog, PluginInfo
from backend.plugins.base import AbstractExporter, AbstractTextGenerator


class PluginRegistry:
    """Registry for all available generator and exporter plugins.

    The registry implements the Registry / Service Locator pattern from the
    practicum report. Business logic asks it for a plugin by name instead of
    importing concrete classes directly.
    """

    def __init__(self) -> None:
        self._generators: dict[str, AbstractTextGenerator] = {}
        self._exporters: dict[str, AbstractExporter] = {}

    def register_generator(self, generator: AbstractTextGenerator) -> None:
        self._generators[generator.name] = generator

    def register_exporter(self, exporter: AbstractExporter) -> None:
        self._exporters[exporter.name] = exporter

    def get_generator(self, name: str) -> AbstractTextGenerator:
        normalized_name = name.lower().strip()
        if normalized_name not in self._generators:
            raise KeyError(
                f'Генератор "{name}" не найден. Доступные генераторы: {self.list_generators()}'
            )
        return self._generators[normalized_name]

    def get_exporter(self, name: str) -> AbstractExporter:
        normalized_name = name.lower().strip()
        if normalized_name not in self._exporters:
            raise KeyError(
                f'Экспортёр "{name}" не найден. Доступные экспортёры: {self.list_exporters()}'
            )
        return self._exporters[normalized_name]

    def list_generators(self) -> list[str]:
        return sorted(self._generators.keys())

    def list_exporters(self) -> list[str]:
        return sorted(self._exporters.keys())

    def catalog(self) -> PluginCatalog:
        return PluginCatalog(
            generators=[
                PluginInfo(name=name, description=plugin.description)
                for name, plugin in sorted(self._generators.items())
            ],
            exporters=[
                PluginInfo(name=name, description=plugin.description)
                for name, plugin in sorted(self._exporters.items())
            ],
        )
