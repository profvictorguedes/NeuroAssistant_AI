import json
import logging
from openai import AzureOpenAI
from app.core.config import settings
from app.core.exceptions import ServiceError
from app.schemas.assistant import AssistantRequest, AssistantResult

logger = logging.getLogger(__name__)

_MODE_INSTRUCTIONS: dict[str, str] = {
    "simplify": "Rewrite the content in plain, simple language. Break complex ideas into short, clear sentences.",
    "prioritize": "Identify and rank the most important actions or information. Remove noise. Return a numbered priority list.",
    "study": "Transform the content into a study aid with a brief summary, key points, a short quiz, and one next step.",
    "focus": "Extract ONE clear next action. Add a suggested time block (in minutes) and one rule to avoid distraction.",
    "calm": "Reframe the content in a calm, reassuring tone. Reduce urgency. Break it into small, manageable steps.",
    "task_breakdown": "Decompose the content into 3–5 concrete, sequenced sub-tasks with clear start and end conditions.",
}


class AzureOpenAIService:
    def __init__(self) -> None:
        if not all([
            settings.azure_openai_endpoint,
            settings.azure_openai_api_key,
            settings.azure_openai_deployment,
        ]):
            raise ServiceError("Azure OpenAI credentials are not fully configured.")

        self._client = AzureOpenAI(
            azure_endpoint=settings.azure_openai_endpoint,
            api_key=settings.azure_openai_api_key,
            api_version=settings.azure_openai_api_version,
        )
        self._deployment = settings.azure_openai_deployment

    def generate(
        self,
        payload: AssistantRequest,
        context: list[str] | None = None,
    ) -> AssistantResult:
        prefs = payload.preferences
        mode_instruction = _MODE_INSTRUCTIONS.get(payload.mode, "Transform the content helpfully.")

        pref_lines: list[str] = []
        if prefs.visual_chunking:
            pref_lines.append("Use visual chunking: short paragraphs and section headers.")
        if prefs.bullet_steps:
            pref_lines.append("Use bullet points or numbered lists.")
        if prefs.calming_tone:
            pref_lines.append("Use a calm, supportive tone. Avoid urgency language.")
        if prefs.deadline_aware:
            pref_lines.append("Highlight any deadlines or time-sensitive items.")
        if prefs.beginner_friendly:
            pref_lines.append("Avoid jargon. Define terms where needed.")
        if prefs.output_style == "concise":
            pref_lines.append("Keep output concise and to the point.")
        elif prefs.output_style == "detailed":
            pref_lines.append("Provide detailed, thorough output.")

        context_block = ""
        if context:
            context_block = (
                "\n\nRelevant grounding context (use this to inform your response):\n"
                + "\n".join(f"- {c}" for c in context)
            )

        system_prompt = (
            f"You are NeuroAssistant AI, an adaptive assistant helping neurodiverse users process information.\n"
            f"Mode: {payload.mode}\n"
            f"Instruction: {mode_instruction}\n\n"
            f"User preferences:\n" + ("\n".join(f"- {l}" for l in pref_lines) or "- None.") +
            context_block +
            "\n\nRespond ONLY with a JSON object matching this exact schema (no markdown, no extra keys):\n"
            '{\n'
            '  "title": "short title for the output (5–10 words)",\n'
            '  "summary": "one sentence describing the transformation",\n'
            '  "transformed_text": "the main transformed content",\n'
            '  "next_actions": ["action 1", "action 2", "action 3"],\n'
            '  "why_this_output": ["reason 1", "reason 2", "reason 3"]\n'
            '}'
        )

        try:
            response = self._client.chat.completions.create(
                model=self._deployment,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": payload.text},
                ],
                response_format={"type": "json_object"},
                max_completion_tokens=1500,
            )

            if not response.choices:
                raise ServiceError("Azure OpenAI returned an empty response. Please try again.")

            data = json.loads(response.choices[0].message.content)

            return AssistantResult(
                title=data.get("title", "AI Output"),
                summary=data.get("summary", ""),
                transformed_text=data.get("transformed_text", ""),
                next_actions=data.get("next_actions", []),
                why_this_output=data.get("why_this_output", []),
            )

        except json.JSONDecodeError as exc:
            raise ServiceError(f"Failed to parse Azure OpenAI response as JSON: {exc}") from exc
        except Exception as exc:
            raise ServiceError(f"Azure OpenAI request failed: {exc}") from exc