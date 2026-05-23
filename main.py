from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.application.dependencies import ApplicationContainer
from backend.presentation.api import create_router


def create_app(container: ApplicationContainer | None = None) -> FastAPI:
    app = FastAPI(
        title="ILoveReports",
        description="Web application to generate comprehensive reports from local data using open-source LLMs via Ollama.",
        version="1.2.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(create_router(container=container))
    return app


app = create_app()
