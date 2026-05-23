from backend.plugins.base import AbstractTextGenerator


class HuggingFaceGenerator(AbstractTextGenerator):
    """Optional HuggingFace plugin loaded lazily only when selected."""

    def __init__(self, model_name: str = "t5-small") -> None:
        self.model_name = model_name
        self._tokenizer = None
        self._model = None

    @property
    def name(self) -> str:
        return "huggingface"

    @property
    def description(self) -> str:
        return f"HuggingFace local model plugin, model={self.model_name}"

    def _load_model(self) -> None:
        if self._model is None:
            try:
                from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
            except ImportError as exc:
                raise RuntimeError(
                    "HuggingFaceGenerator requires optional dependencies: transformers and torch."
                ) from exc
            self._tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self._model = AutoModelForSeq2SeqLM.from_pretrained(self.model_name)

    def generate(self, prompt: str) -> str:
        self._load_model()
        inputs = self._tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512)
        outputs = self._model.generate(**inputs, max_length=512, num_beams=4)
        return self._tokenizer.decode(outputs[0], skip_special_tokens=True)
