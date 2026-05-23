"""Compatibility exports for the original clean-architecture port names.

The ipynb practicum report requires abstract base classes for plugins. These
aliases keep the old names while the real interfaces now live in
`backend.plugins.base`.
"""

from backend.plugins.base import AbstractExporter as DocumentExporter
from backend.plugins.base import AbstractTextGenerator as TextGenerator

__all__ = ["DocumentExporter", "TextGenerator"]
