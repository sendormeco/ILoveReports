# ILoveReports

ILoveReports is a web application for generating comprehensive reports from local user data. The backend uses FastAPI and can call open-source LLMs through Ollama. The frontend is built with React and TypeScript.

## What was changed according to the ipynb report

The project was refactored into a multi-class plugin architecture:

- text generators are plugins behind `AbstractTextGenerator`;
- document exporters are plugins behind `AbstractExporter`;
- `PluginRegistry` stores available generators and exporters;
- `ReportService` orchestrates prompt building, text generation and export;
- `ApplicationContainer` wires dependencies through Dependency Injection;
- `/plugins` shows available plugins;
- `/export/{exporter_name}` allows exporting not only DOCX, but also Markdown.

The implementation follows the practicum idea: **Strategy + Registry + Dependency Injection + Service**.

## Backend structure

```text
backend/
  domain/
    models.py
  application/
    dependencies.py
    plugin_registry.py
    prompt_builder.py
    report_service.py
    use_cases.py
  plugins/
    base.py
    generators/
      ollama.py
      static.py
      huggingface.py
    exporters/
      docx.py
      markdown.py
  infrastructure/
    ... compatibility imports for old adapter names
  presentation/
    api.py
main.py
```

## Frontend structure

```text
frontend/src/
  domain/
    report.ts
  services/
    reportApi.ts
  application/
    reportUseCases.ts
  components/
    ReportForm.tsx
    ReportPreview.tsx
    HistoryPage.tsx
  App.tsx
```

## Available backend plugins

### Text generators

- `ollama` — local open-source LLM through Ollama;
- `static` — deterministic local test generator;
- `mock` — mock generator for tests and demos;
- `huggingface` — optional HuggingFace generator.

### Exporters

- `docx` — Word document;
- `markdown` — Markdown file.

## Run backend

Install dependencies:

```bash
pip install -r requirements.txt
```

Run in test mode without Ollama:

```bash
TEXT_GENERATOR=static uvicorn main:app --reload
```

Run with Ollama:

```bash
TEXT_GENERATOR=ollama OLLAMA_MODEL=llama3 uvicorn main:app --reload
```

On Windows PowerShell:

```powershell
$env:TEXT_GENERATOR="static"
uvicorn main:app --reload
```

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

By default, the frontend reads the backend URL from `VITE_API_URL`.

```env
VITE_API_URL=http://127.0.0.1:8000
```

## API endpoints

- `GET /` — backend status;
- `GET /health` — health check;
- `GET /plugins` — available generators and exporters;
- `POST /generate` — generate a report text;
- `POST /generate-docx` — export generated report to DOCX;
- `POST /export/{exporter_name}` — export through a selected plugin, for example `/export/markdown`.

## Example: generate through static plugin

```bash
curl -X POST http://127.0.0.1:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "goal":"Проверить архитектуру",
    "process":"Созданы плагины, реестр и сервис",
    "results":"Backend работает без Ollama в static-режиме",
    "conclusion":"Рефакторинг выполнен",
    "generator":"static"
  }'
```

## Documentation

See:

- `docs/use_cases.md`
- `docs/class_diagram.md`
- `docs/interaction_diagrams.md`
- `docs/plugin_architecture.md`
- `docs/maintainability_replaceability.md`
- `docs/implementation.md`
