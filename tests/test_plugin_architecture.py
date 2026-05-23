from fastapi.testclient import TestClient

from backend.application.dependencies import ApplicationContainer, ApplicationSettings
from main import create_app


def make_client() -> TestClient:
    settings = ApplicationSettings(text_generator="static", document_exporter="docx")
    return TestClient(create_app(ApplicationContainer(settings=settings)))


def test_plugins_endpoint_lists_generators_and_exporters():
    client = make_client()

    response = client.get("/plugins")

    assert response.status_code == 200
    body = response.json()
    generator_names = {item["name"] for item in body["generators"]}
    exporter_names = {item["name"] for item in body["exporters"]}
    assert {"ollama", "static", "mock", "huggingface"}.issubset(generator_names)
    assert {"docx", "markdown"}.issubset(exporter_names)


def test_generate_report_with_static_plugin():
    client = make_client()

    response = client.post(
        "/generate",
        json={
            "goal": "Проверить архитектуру",
            "process": "Созданы плагины, реестр и сервис",
            "results": "Static plugin works",
            "conclusion": "Рефакторинг выполнен",
            "generator": "static",
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["generator"] == "static"
    assert "тестовый отчёт" in body["report"].lower()


def test_export_report_to_markdown_plugin():
    client = make_client()

    response = client.post(
        "/export/markdown",
        json={
            "title": "Demo",
            "report": "# Текст отчёта",
            "author": "Student",
            "organization": "University",
            "date": "2026-05-13",
        },
    )

    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/markdown")
    assert b"# Demo" in response.content
