# Диаграмма классов

Диаграмма отражает реализацию после доработки по ipynb: генераторы и экспортёры оформлены как плагины, а зависимости передаются через контейнер.

```mermaid
classDiagram
    direction LR

    class ReportRequest {
        +goal: str
        +process: str
        +results: str
        +conclusion: str
        +tone: str
        +report_type: str
        +generator: str
    }

    class GeneratedReport {
        +report: str
        +generator: str
    }

    class DocxRequest {
        +title: str
        +report: str
        +author: str
        +organization: str
        +date: str
        +supervisor: str
        +exporter: str
    }

    class ExportedDocument {
        +content: bytes
        +filename: str
        +media_type: str
        +file_extension: str
    }

    class AbstractTextGenerator {
        <<abstract>>
        +name: str
        +description: str
        +generate(prompt): str
    }

    class StaticGenerator {
        +name: str
        +generate(prompt): str
    }

    class MockGenerator {
        +name: str
        +generate(prompt): str
    }

    class OllamaGenerator {
        +model: str
        +ollama_bin: str
        +timeout_seconds: int
        +name: str
        +generate(prompt): str
    }

    class HuggingFaceGenerator {
        +model_name: str
        +name: str
        +generate(prompt): str
        -_load_model()
    }

    class AbstractExporter {
        <<abstract>>
        +name: str
        +file_extension: str
        +media_type: str
        +export(payload): ExportedDocument
        +safe_filename(title, extension): str
    }

    class DocxExporter {
        +name: str
        +file_extension: str
        +media_type: str
        +export(payload): ExportedDocument
    }

    class MarkdownExporter {
        +name: str
        +file_extension: str
        +media_type: str
        +export(payload): ExportedDocument
    }

    class PluginRegistry {
        -generators: dict
        -exporters: dict
        +register_generator(generator)
        +register_exporter(exporter)
        +get_generator(name): AbstractTextGenerator
        +get_exporter(name): AbstractExporter
        +list_generators(): list
        +list_exporters(): list
        +catalog()
    }

    class ReportPromptBuilder {
        +build(data): str
    }

    class ReportService {
        +registry: PluginRegistry
        +prompt_builder: ReportPromptBuilder
        +default_generator: str
        +default_exporter: str
        +generate_report(data): GeneratedReport
        +export_report(payload, exporter_name): ExportedDocument
    }

    class GenerateReportUseCase {
        +report_service: ReportService
        +execute(data): GeneratedReport
    }

    class ExportReportUseCase {
        +report_service: ReportService
        +execute(payload, exporter_name): ExportedDocument
    }

    class GenerateDocxUseCase {
        +execute(payload, exporter_name): ExportedDocument
    }

    class ApplicationSettings {
        +text_generator: str
        +document_exporter: str
        +ollama_bin: str
        +ollama_model: str
        +ollama_timeout_seconds: int
        +huggingface_model: str
        +from_env(): ApplicationSettings
    }

    class ApplicationContainer {
        +settings: ApplicationSettings
        +plugin_registry(): PluginRegistry
        +report_service(): ReportService
        +generate_report_use_case(): GenerateReportUseCase
        +export_report_use_case(): ExportReportUseCase
        +generate_docx_use_case(): GenerateDocxUseCase
    }

    AbstractTextGenerator <|-- StaticGenerator
    StaticGenerator <|-- MockGenerator
    AbstractTextGenerator <|-- OllamaGenerator
    AbstractTextGenerator <|-- HuggingFaceGenerator

    AbstractExporter <|-- DocxExporter
    AbstractExporter <|-- MarkdownExporter

    PluginRegistry o-- AbstractTextGenerator
    PluginRegistry o-- AbstractExporter

    ReportService --> PluginRegistry
    ReportService --> ReportPromptBuilder
    ReportService --> ReportRequest
    ReportService --> DocxRequest
    ReportService --> GeneratedReport
    ReportService --> ExportedDocument

    GenerateReportUseCase --> ReportService
    ExportReportUseCase --> ReportService
    GenerateDocxUseCase --|> ExportReportUseCase

    ApplicationContainer --> ApplicationSettings
    ApplicationContainer --> PluginRegistry
    ApplicationContainer --> ReportService
    ApplicationContainer --> GenerateReportUseCase
    ApplicationContainer --> ExportReportUseCase
    ApplicationContainer --> GenerateDocxUseCase
```

## Что показывает диаграмма

Диаграмма показывает, какие классы участвуют в генерации и экспорте отчётов. Главная идея: `ReportService` не зависит напрямую от конкретной LLM или конкретного формата файла. Он работает с абстракциями `AbstractTextGenerator` и `AbstractExporter`, а конкретную реализацию получает через `PluginRegistry`.

## Что означает каждый класс

| Класс | За что отвечает |
|---|---|
| `ReportRequest` | DTO входных данных для генерации отчёта. Хранит цель, ход работы, результаты, вывод, тон и выбранный генератор. |
| `GeneratedReport` | DTO результата генерации. Содержит готовый текст отчёта и имя использованного генератора. |
| `DocxRequest` | DTO входных данных для экспорта. Содержит заголовок, текст отчёта, автора, организацию, дату, руководителя и выбранный экспортёр. |
| `ExportedDocument` | DTO результата экспорта. Хранит байты файла, имя файла, MIME-тип и расширение. |
| `AbstractTextGenerator` | Абстрактный интерфейс для всех генераторов текста. Требует метод `generate(prompt)`. |
| `StaticGenerator` | Простой детерминированный генератор. Нужен для проверки backend без Ollama. |
| `MockGenerator` | Заглушка для демонстрации и unit-тестирования. Наследуется от `StaticGenerator`. |
| `OllamaGenerator` | Генератор через локальную Ollama. Хранит модель, путь к команде Ollama и timeout. |
| `HuggingFaceGenerator` | Опциональный генератор через HuggingFace. Загружает модель лениво, только при использовании. |
| `AbstractExporter` | Абстрактный интерфейс для всех экспортёров документов. Требует `export(payload)`. |
| `DocxExporter` | Экспортирует отчёт в Microsoft Word `.docx`. |
| `MarkdownExporter` | Экспортирует отчёт в Markdown `.md`. |
| `PluginRegistry` | Реестр плагинов. Регистрирует генераторы/экспортёры и возвращает нужный плагин по имени. |
| `ReportPromptBuilder` | Строит промпт для LLM из локальных данных пользователя. |
| `ReportService` | Главный сервис приложения. Оркестрирует генерацию и экспорт через реестр плагинов. |
| `GenerateReportUseCase` | Use case генерации текста отчёта. Делегирует работу `ReportService`. |
| `ExportReportUseCase` | Общий use case экспорта отчёта в выбранный формат. |
| `GenerateDocxUseCase` | Совместимый use case для DOCX. По умолчанию вызывает экспортёр `docx`. |
| `ApplicationSettings` | Читает настройки из окружения: генератор, экспортёр, модель Ollama, timeout, HuggingFace-модель. |
| `ApplicationContainer` | Dependency Injection container. Создаёт и связывает настройки, реестр, сервисы и use cases. |

## Как объяснить связи между классами

| Связь | Объяснение |
|---|---|
| `AbstractTextGenerator <|-- ...` | Конкретные генераторы наследуются от общего интерфейса. Поэтому их можно взаимозаменять. |
| `AbstractExporter <|-- ...` | Конкретные экспортёры наследуются от общего интерфейса. Поэтому можно добавлять новые форматы файлов. |
| `PluginRegistry o-- AbstractTextGenerator` | Реестр хранит набор зарегистрированных генераторов. |
| `PluginRegistry o-- AbstractExporter` | Реестр хранит набор зарегистрированных экспортёров. |
| `ReportService --> PluginRegistry` | Сервис не создаёт плагины сам, а получает их из реестра. |
| `ReportService --> ReportPromptBuilder` | Сервис использует отдельный класс для сборки промпта. |
| `GenerateReportUseCase --> ReportService` | Use case запускает бизнес-сценарий генерации через сервис. |
| `ExportReportUseCase --> ReportService` | Use case запускает бизнес-сценарий экспорта через сервис. |
| `ApplicationContainer --> ...` | Контейнер создаёт зависимости и передаёт их туда, где они нужны. |

## Если кратко

Можно сказать так:

> Мы выделили общие абстракции для генераторов текста и экспортёров документов. Благодаря этому backend не зависит от конкретной реализации Ollama или DOCX. `ReportService` работает с интерфейсами, `PluginRegistry` хранит реализации, а `ApplicationContainer` собирает зависимости. Поэтому систему можно расширять новыми генераторами и форматами экспорта без переписывания основной бизнес-логики.
