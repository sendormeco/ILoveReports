"""Legacy playground file.

The project no longer uses HuggingFace T5 for report generation. The production
path is FastAPI -> GenerateReportUseCase -> TextGenerator port -> Ollama adapter.

Run the backend with:
    TEXT_GENERATOR=static uvicorn main:app --reload
or:
    TEXT_GENERATOR=ollama OLLAMA_MODEL=llama3 uvicorn main:app --reload
"""

print("Use main.py and backend/application/use_cases.py for report generation.")
