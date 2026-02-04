from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

tokenizer = AutoTokenizer.from_pretrained("t5-small")
model = AutoModelForSeq2SeqLM.from_pretrained("t5-small")

prompt = (
    "rewrite the following notes as a formal laboratory report paragraph:\n"
    "notes: The RC circuit was assembled. Voltage across the capacitor "
    "was measured over time. The voltage increased exponentially."
)

inputs = tokenizer(prompt, return_tensors="pt")

outputs = model.generate(
    **inputs,
    max_length=60,
    num_beams=4
)

print(tokenizer.decode(outputs[0], skip_special_tokens=True))