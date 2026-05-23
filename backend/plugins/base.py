from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
import re

from backend.domain.models import DocxRequest


@dataclass(frozen=True)
class ExportedDocument:
    """Binary result returned by exporter plugins."""

    content: bytes
    filename: str
    media_type: str
    file_extension: str


class AbstractTextGenerator(ABC):
    """Base class for all replaceable text-generation plugins."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Stable plugin name used by the registry and API."""
        raise NotImplementedError

    @property
    def description(self) -> str:
        return self.__class__.__doc__ or "Text generator plugin"

    @abstractmethod
    def generate(self, prompt: str) -> str:
        """Generate a report body from a ready LLM prompt."""
        raise NotImplementedError


class AbstractExporter(ABC):
    """Base class for all replaceable document exporter plugins."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Stable plugin name used by the registry and API."""
        raise NotImplementedError

    @property
    @abstractmethod
    def file_extension(self) -> str:
        raise NotImplementedError

    @property
    @abstractmethod
    def media_type(self) -> str:
        raise NotImplementedError

    @property
    def description(self) -> str:
        return self.__class__.__doc__ or "Document exporter plugin"

    @abstractmethod
    def export(self, payload: DocxRequest) -> ExportedDocument:
        """Export a report into a binary document."""
        raise NotImplementedError

    @staticmethod
    def safe_filename(title: str, extension: str) -> str:
        clean = re.sub(r"[^\w\-. а-яА-ЯёЁ]+", "_", title, flags=re.UNICODE).strip("_ ")
        extension = extension if extension.startswith(".") else f".{extension}"
        return f"{clean or 'report'}{extension}"
