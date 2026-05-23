# Реализация

## 1. Что было изменено в коде

Проект переделан по отчёту `ProjectPracticum_MultiClass_Plugins.ipynb`, где требовалось организовать многоклассовость, плагины и зависимости.

### Backend

| Файл | Назначение |
|---|---|
| `backend/plugins/base.py` | Абстрактные базовые классы `AbstractTextGenerator`, `AbstractExporter` и DTO `ExportedDocument`. |
| `backend/plugins/generators/ollama.py` | Плагин генерации через локальную Ollama. |
| `backend/plugins/generators/static.py` | Тестовые плагины `StaticGenerator` и `MockGenerator`. |
| `backend/plugins/generators/huggingface.py` | Опциональный плагин HuggingFace. |
| `backend/plugins/exporters/docx.py` | Плагин экспорта в DOCX. |
| `backend/plugins/exporters/markdown.py` | Плагин экспорта в Markdown. |
| `backend/application/plugin_registry.py` | Реестр плагинов `PluginRegistry`. |
| `backend/application/report_service.py` | Сервис `ReportService`, который связывает генерацию и экспорт. |
| `backend/application/dependencies.py` | Dependency Injection container `ApplicationContainer` и настройки `ApplicationSettings`. |
| `backend/application/prompt_builder.py` | Класс `ReportPromptBuilder`, который строит промпт для LLM. |
| `backend/application/use_cases.py` | Use cases: `GenerateReportUseCase`, `ExportReportUseCase`, `GenerateDocxUseCase`. |
| `backend/presentation/api.py` | FastAPI endpoints для генерации, экспорта и списка плагинов. |

### Frontend

| Файл | Назначение |
|---|---|
| `frontend/src/domain/report.ts` | TypeScript-типы отчёта, payload-ов и каталога плагинов. |
| `frontend/src/application/reportUseCases.ts` | Frontend use cases: генерация отчёта, скачивание DOCX, получение списка плагинов. |
| `frontend/src/services/reportApi.ts` | API-клиент, который отправляет запросы на backend. |
| `frontend/src/components/ReportForm.tsx` | Форма заполнения данных отчёта. |
| `frontend/src/components/ReportPreview.tsx` | Предпросмотр отчёта и скачивание результата. |
| `frontend/src/components/HistoryPage.tsx` | История отчётов текущей frontend-сессии. |
| `frontend/src/App.tsx` | Главный компонент, который связывает страницы, состояние и обработчики. |

## 2. Новые и обновлённые API endpoints

| Метод | URL | Назначение |
|---|---|---|
| `GET` | `/` | Проверка, что backend запущен. |
| `GET` | `/health` | Проверка состояния backend-а и текущих настроек. |
| `GET` | `/plugins` | Получить список доступных генераторов и экспортёров. |
| `POST` | `/generate` | Сгенерировать текст отчёта через выбранный генератор. |
| `POST` | `/generate-docx` | Скачать отчёт в DOCX через совместимый endpoint. |
| `POST` | `/export/{exporter_name}` | Скачать отчёт через выбранный экспортёр, например `markdown`. |

## 3. Как работает генерация отчёта

1. Пользователь заполняет форму в `ReportForm`.
2. Frontend вызывает `generateComprehensiveReport`.
3. `reportApi.ts` отправляет `POST /generate`.
4. FastAPI принимает `ReportRequest`.
5. `ApplicationContainer` выдаёт `GenerateReportUseCase`.
6. `GenerateReportUseCase` вызывает `ReportService.generate_report`.
7. `ReportService` строит промпт через `ReportPromptBuilder`.
8. `ReportService` выбирает генератор через `PluginRegistry`.
9. Выбранный генератор возвращает текст.
10. Backend возвращает `GeneratedReport`.
11. Frontend показывает результат в `ReportPreview`.

## 4. Как работает генерация через Ollama

1. В настройках выбран генератор `ollama`, например через `.env`:
   ```env
   TEXT_GENERATOR=ollama
   OLLAMA_MODEL=llama3
   ```
2. `ReportService` вызывает:
   ```python
   registry.get_generator("ollama")
   ```
3. `PluginRegistry` возвращает объект `OllamaGenerator`.
4. `OllamaGenerator` вызывает внешнюю команду:
   ```text
   ollama run llama3
   ```
5. Prompt передаётся в процесс через `stdin`.
6. Ответ модели читается из `stdout`.
7. Если `returncode == 0`, текст возвращается как результат генерации.
8. Если Ollama недоступна, backend возвращает ошибку, например HTTP 502.

## 5. Как работает экспорт DOCX

1. Пользователь нажимает кнопку скачивания.
2. Frontend отправляет `POST /generate-docx`.
3. FastAPI принимает `DocxRequest`.
4. `ApplicationContainer` выдаёт `GenerateDocxUseCase`.
5. `GenerateDocxUseCase` вызывает общий экспорт через `ReportService`.
6. `ReportService` берёт `DocxExporter` из `PluginRegistry`.
7. `DocxExporter` создаёт `.docx` файл через `python-docx`.
8. Backend возвращает файл через `StreamingResponse`.
9. Frontend получает `Blob` и запускает скачивание.

## 6. Как работает экспорт Markdown

1. Клиент отправляет:
   ```http
   POST /export/markdown
   ```
2. FastAPI передаёт `exporter_name = "markdown"` в `ExportReportUseCase`.
3. `ReportService` вызывает:
   ```python
   registry.get_exporter("markdown")
   ```
4. `MarkdownExporter` формирует `.md` файл.
5. Backend возвращает файл через `StreamingResponse`.

## 7. Что делает каждый ключевой класс

| Класс | Назначение |
|---|---|
| `ReportRequest` | Входная модель для генерации отчёта. |
| `GeneratedReport` | Ответ backend-а после генерации текста. |
| `DocxRequest` | Входная модель для экспорта отчёта в файл. |
| `ExportedDocument` | Универсальный результат экспорта: bytes, filename, media_type, extension. |
| `AbstractTextGenerator` | Общий контракт для генераторов текста. |
| `OllamaGenerator` | Запускает Ollama через `subprocess` и получает ответ LLM. |
| `StaticGenerator` | Возвращает тестовый отчёт без внешних зависимостей. |
| `MockGenerator` | Заглушка для тестов и демонстрации. |
| `HuggingFaceGenerator` | Опциональный генератор через HuggingFace. |
| `AbstractExporter` | Общий контракт для экспортёров документов. |
| `DocxExporter` | Создаёт Word-документ. |
| `MarkdownExporter` | Создаёт Markdown-документ. |
| `PluginRegistry` | Хранит и выдаёт плагины по имени. |
| `ReportPromptBuilder` | Собирает промпт из данных пользователя. |
| `ReportService` | Координирует генерацию и экспорт. |
| `ApplicationSettings` | Читает настройки из переменных окружения. |
| `ApplicationContainer` | Создаёт зависимости и передаёт их в сервисы/use cases. |

## 8. Почему это соответствует ipynb

В ipynb были обозначены идеи многоклассовости, плагинов и зависимостей. В проекте это реализовано так:

| Требование | Как реализовано |
|---|---|
| Многоклассовость | Логика разделена на DTO, use cases, сервисы, плагины, контейнер и API. |
| Абстрактный генератор | `AbstractTextGenerator`. |
| Несколько генераторов | `OllamaGenerator`, `StaticGenerator`, `MockGenerator`, `HuggingFaceGenerator`. |
| Абстрактный экспортёр | `AbstractExporter`. |
| Несколько экспортёров | `DocxExporter`, `MarkdownExporter`. |
| Реестр плагинов | `PluginRegistry`. |
| Dependency Injection | `ApplicationContainer`. |
| Сервис-оркестратор | `ReportService`. |

## 9. Проверка работы

### Режим без Ollama

```bash
TEXT_GENERATOR=static uvicorn main:app --reload
```

### Проверка списка плагинов

```bash
curl http://127.0.0.1:8000/plugins
```

### Проверка генерации

```bash
curl -X POST http://127.0.0.1:8000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Проверить архитектуру",
    "process": "Созданы плагины, реестр и сервис",
    "results": "Backend работает без Ollama в static-режиме",
    "conclusion": "Рефакторинг выполнен",
    "generator": "static"
  }'
```

### Проверка DOCX-экспорта

```bash
curl -X POST http://127.0.0.1:8000/generate-docx \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Demo",
    "report": "Текст отчёта",
    "author": "Student",
    "organization": "University",
    "date": "2026-05-13"
  }' \
  -o report.docx
```

### Проверка Markdown-экспорта

```bash
curl -X POST http://127.0.0.1:8000/export/markdown \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Demo",
    "report": "# Текст отчёта",
    "author": "Student",
    "organization": "University",
    "date": "2026-05-13"
  }' \
  -o report.md
```

## 10. Если коротко

Можно сказать так:

> В реализации backend разделён на несколько уровней. API принимает запросы, use cases описывают сценарии, `ReportService` выполняет основную бизнес-логику, `PluginRegistry` выбирает нужный плагин, а конкретные генераторы и экспортёры изолированы в отдельных классах. Благодаря этому можно заменить Ollama на другой генератор или DOCX на другой формат без переписывания основной логики приложения.
