from backend.plugins.base import AbstractTextGenerator


class StaticGenerator(AbstractTextGenerator):
    """Deterministic local generator used for tests and demos without Ollama."""

    @property
    def name(self) -> str:
        return "static"

    def generate(self, prompt: str) -> str:
        return (
            "# Сгенерированный тестовый отчёт\n\n"
            "## Введение\n"
            "Это тестовый отчёт, созданный статическим генератором. Он нужен для проверки backend без запуска Ollama.\n\n"
            "## Цель работы\n"
            "Система получила локальные данные пользователя и подготовила структуру отчёта.\n\n"
            "## Ход работы\n"
            "Use case сформировал промпт и обратился к плагину TextGenerator через общий интерфейс.\n\n"
            "## Результаты\n"
            "Архитектура позволяет заменить StaticGenerator на OllamaGenerator, HuggingFaceGenerator "
            "или другой плагин без изменения бизнес-логики.\n\n"
            "## Заключение\n"
            "Проект готов к локальной генерации comprehensive reports через open-source LLMs в Ollama.\n\n"
            "---\n"
            "Фрагмент промпта для проверки связки:\n"
            f"{prompt[:350]}"
        )


class MockGenerator(StaticGenerator):
    """Mock plugin from the practicum report; useful for unit tests."""

    @property
    def name(self) -> str:
        return "mock"
