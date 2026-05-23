import os
import subprocess

from backend.plugins.base import AbstractTextGenerator


class OllamaGenerator(AbstractTextGenerator):
    """Text-generation plugin for local open-source LLMs launched through Ollama."""

    def __init__(
        self,
        model: str | None = None,
        ollama_bin: str | None = None,
        timeout_seconds: int | None = None,
    ) -> None:
        self.model = model or os.getenv("OLLAMA_MODEL", "llama3")
        self.ollama_bin = ollama_bin or os.getenv("OLLAMA_BIN", "ollama")
        self.timeout_seconds = timeout_seconds or int(os.getenv("OLLAMA_TIMEOUT_SECONDS", "300"))

    @property
    def name(self) -> str:
        return "ollama"

    @property
    def description(self) -> str:
        return f"Ollama local LLM plugin, model={self.model}"

    def generate(self, prompt: str) -> str:
        try:
            completed = subprocess.run(
                [self.ollama_bin, "run", self.model],
                input=prompt,
                capture_output=True,
                text=True,
                encoding="utf-8",
                timeout=self.timeout_seconds,
                check=False,
            )
        except subprocess.TimeoutExpired as exc:
            raise RuntimeError("Ollama timed out") from exc
        except FileNotFoundError as exc:
            raise RuntimeError(
                f"Ollama executable was not found: {self.ollama_bin}. "
                "Set OLLAMA_BIN or switch TEXT_GENERATOR=static."
            ) from exc

        if completed.returncode != 0:
            raise RuntimeError(f"Ollama failed: {completed.stderr.strip()}")

        return completed.stdout.strip()
