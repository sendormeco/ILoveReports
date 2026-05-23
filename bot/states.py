from aiogram.fsm.state import StatesGroup, State

class ReportState(StatesGroup):
    title = State()
    author = State()
    organization = State()
    goal = State()
    process = State()
    conclusion = State()
    tone = State()
    screenshots = State()
