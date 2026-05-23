import requests
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.utils.keyboard import ReplyKeyboardBuilder
from states import ReportState

BOT_TOKEN = "8565862954:AAGUaSgZPgqlH9HyZILlATqreyHr4KPrIq8"
BACKEND_TEXT_URL = "http://127.0.0.1:8000/generate"
BACKEND_DOCX_URL = "http://127.0.0.1:8000/generate-docx"

bot = Bot(BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())

# ===== Удобная функция для оставшихся шагов =====
def steps_left(current_step):
    total_steps = 7  # title, author, org, goal, process, conclusion, tone
    return total_steps - current_step

# ===== Start =====
@dp.message(Command("start"))
async def start(msg: types.Message, state: FSMContext):
    await state.clear()
    await msg.answer(f"Введите название отчёта (шаг 1/{7}):")
    await state.set_state(ReportState.title)

@dp.message(ReportState.title)
async def title(msg: types.Message, state: FSMContext):
    await state.update_data(title=msg.text)
    await msg.answer(f"Введите автора (шаг 2/{7}):")
    await state.set_state(ReportState.author)

@dp.message(ReportState.author)
async def author(msg: types.Message, state: FSMContext):
    await state.update_data(author=msg.text)
    await msg.answer(f"Введите организацию (шаг 3/{7}):")
    await state.set_state(ReportState.organization)

@dp.message(ReportState.organization)
async def organization(msg: types.Message, state: FSMContext):
    await state.update_data(organization=msg.text)
    await msg.answer(f"Введите цель работы (шаг 4/{7}):")
    await state.set_state(ReportState.goal)

@dp.message(ReportState.goal)
async def goal(msg: types.Message, state: FSMContext):
    await state.update_data(goal=msg.text)
    await msg.answer(f"Опишите ход работы (шаг 5/{7}):")
    await state.set_state(ReportState.process)

@dp.message(ReportState.process)
async def process(msg: types.Message, state: FSMContext):
    await state.update_data(process=msg.text)
    await msg.answer(f"Введите выводы (шаг 6/{7}):")
    await state.set_state(ReportState.conclusion)

@dp.message(ReportState.conclusion)
async def conclusion(msg: types.Message, state: FSMContext):
    await state.update_data(conclusion=msg.text)
    # Клавиатура с кнопкой "Пропустить"
    kb = ReplyKeyboardBuilder()
    kb.button(text="Пропустить")
    kb.adjust(1)
    await msg.answer(
        f"Опишите желаемый стиль отчёта (шаг 7/{7}):",
        reply_markup=kb.as_markup(resize_keyboard=True, one_time_keyboard=True)
    )
    await state.set_state(ReportState.tone)

@dp.message(ReportState.tone)
async def tone(msg: types.Message, state: FSMContext):
    await msg.answer("Отчёт готовится, займёт некоторое время. Пожалуйста, подождите.", reply_markup=types.ReplyKeyboardRemove())
    data = await state.get_data()
    tone_text = "" if msg.text.lower() == "пропустить" else msg.text

    # ===== Генерация текста =====
    payload_text = {
        "title": data["title"],
        "goal": data["goal"],
        "process": data["process"],
        "results": "",
        "conclusion": data["conclusion"],
        "tone": tone_text,
        "author": data["author"],
        "organization": data["organization"],
    }

    try:
        r = requests.post(BACKEND_TEXT_URL, json=payload_text, timeout=300)
        r.raise_for_status()
        report_text = r.json().get("report", "")
    except Exception as e:
        await msg.answer(f"Ошибка генерации текста: {e}")
        return

    # ===== Генерация DOCX =====
    docx_payload = {
        "title": data["title"],
        "author": data["author"],
        "organization": data["organization"],
        "report": report_text,
        "supervisor": "",  # можно добавить позже
        "date": "",        # можно добавить позже
    }

    try:
        r = requests.post(BACKEND_DOCX_URL, json=docx_payload, timeout=300)
        r.raise_for_status()
        with open("report.docx", "wb") as f:
            f.write(r.content)
    except Exception as e:
        await msg.answer(f"Ошибка генерации DOCX: {e}")
        return

    await msg.answer_document(types.FSInputFile("report.docx"))
    await state.clear()


if __name__ == "__main__":
    import asyncio
    asyncio.run(dp.start_polling(bot))
