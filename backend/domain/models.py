from typing import Optional

from pydantic import BaseModel, Field


class ReportRequest(BaseModel):
    """Input data collected from the local frontend form."""

    goal: str = Field(..., min_length=1, description="Report goal or task")
    process: str = Field(..., min_length=1, description="Local data: work/process description")
    results: str = Field("", description="Local data: measured or observed results")
    conclusion: str = Field(..., min_length=1, description="Local data: final conclusion")
    tone: Optional[str] = Field(None, description="Optional style/tone instructions")
    report_type: Optional[str] = Field(
        "comprehensive",
        description="Type of report to generate. The default is a comprehensive report.",
    )
    generator: Optional[str] = Field(
        None,
        description="Optional text generator plugin name: ollama, static, mock, huggingface, etc.",
    )

    class Config:
        extra = "allow"


class GeneratedReport(BaseModel):
    report: str
    generator: Optional[str] = None


class DocxRequest(BaseModel):
    title: str
    report: str
    author: str
    organization: str
    date: str
    supervisor: Optional[str] = None
    exporter: Optional[str] = Field(
        None,
        description="Optional exporter plugin name: docx, markdown, etc.",
    )

    class Config:
        extra = "allow"


class PluginInfo(BaseModel):
    name: str
    description: str


class PluginCatalog(BaseModel):
    generators: list[PluginInfo]
    exporters: list[PluginInfo]
