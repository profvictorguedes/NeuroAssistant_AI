from typing import Literal
from pydantic import BaseModel, Field

AssistantMode = Literal[
    "simplify",
    "prioritize",
    "study",
    "focus",
    "calm",
    "task_breakdown",
]

OutputStyle = Literal["concise", "balanced", "detailed"]

class Preferences(BaseModel):
    output_style: OutputStyle = "balanced"
    visual_chunking: bool = True 
    bullet_steps: bool = True
    calming_tone: bool = True
    deadline_aware: bool = True 
    beginner_friendly: bool = True

class AssistantRequest(BaseModel):
    mode: AssistantMode
    text: str = Field(min_length=10, max_length=12000)
    preferences: Preferences 

class AssistantResult(BaseModel):
    title: str
    summary: str 
    transformed_text: str
    next_actions: list[str] 
    why_this_output: list[str]
    safety_passed: bool = True
    grounded_sources: list[str] = []
    used_services: list[str] = [] 

class AssistantResponse(BaseModel):
    success: bool = True 
    result: AssistantResult