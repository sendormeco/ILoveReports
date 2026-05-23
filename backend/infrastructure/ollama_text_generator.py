"""Backward-compatible import for the Ollama generator plugin."""

from backend.plugins.generators.ollama import OllamaGenerator


class OllamaTextGenerator(OllamaGenerator):
    pass
