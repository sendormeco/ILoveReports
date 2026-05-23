"""Backward-compatible import for the static generator plugin."""

from backend.plugins.generators.static import StaticGenerator


class StaticTextGenerator(StaticGenerator):
    pass
