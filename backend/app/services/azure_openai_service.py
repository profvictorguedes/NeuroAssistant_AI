from openai import AzureOpenAI

from app.core.config import settings
from app.core.exceptions import ServiceError
from app.schemas.assistant import AssistantRequest, AssistantResult


MODE_INSTRUCTIONS = {
    "simplify": "Rewrite the user's content in clearer, easier language. Reduce cognitive load. Keep it calm and actionable.",
    "prioritize": "Turn the user's content into a priority-first plan. Put urgent and high-value actions first. Remove noise.",
    "study": "Turn the user's content into a study support response with: summary, key points, 3 quiz questions, and next study step.",
    "focus": "Give one clear next action, a short focus plan, and a low-overwhelm workflow.",
    "calm": "Use supportive, calm, lower-pressure language. Break the work into gentle, manageable steps.",
    "task_breakdown": "Break the user's goal into a step-by-step checklist with 5 to 8 concrete actions.",
}


class AzureOpenAIService:
    def __init__(self) -> None:
        if not all([
            settings.azure_openai_endpoint,
            settings.azure_openai_api_key,
            settings.azure_openai_deployment,
        ]):
            raise ServiceError("Azure OpenAI is not configured yet.")

        self.client = AzureOpenAI(
            api_key=settings.azure_openai_api_key,
            api_version=settings.azure_openai_api_version,
            azure_endpoint=settings.azure_openai_endpoint,
        )

    def generate(self, payload: AssistantRequest) -> AssistantResult:
        mode_instruction = MODE_INSTRUCTIONS.get(
            payload.mode,
            "Transform the user's content into a clearer, more actionable output."
        )

        preference_notes = [
            f"Output style: {payload.preferences.output_style}",
            f"Visual chunking: {payload.preferences.visual_chunking}",
            f"Bullet steps: {payload.preferences.bullet_steps}",
            f"Calming tone: {payload.preferences.calming_tone}",
            f"Deadline aware: {payload.preferences.deadline_aware}",
            f"Beginner friendly: {payload.preferences.beginner_friendly}",
        ]

        system_prompt = f"""
You are NeuroAssistant AI, an adaptive cognitive load reduction assistant for neurodiverse users.

Your goals:
- Reduce overwhelm
- Clarify dense information
- Make work and learning easier to start
- Use structured, readable formatting
- Be supportive, not patronizing
- Avoid unnecessary verbosity

Mode behavior:
{mode_instruction}

User preferences:
{chr(10).join(preference_notes)}

Return your answer in this exact format:

TITLE:
<short title>

SUMMARY:
<2-3 sentence summary>

TRANSFORMED_TEXT:
<main transformed content>

NEXT_ACTIONS:
- <action 1>
- <action 2>
- <action 3>

WHY_THIS_OUTPUT:
- <reason 1>
- <reason 2>
- <reason 3>
""".strip()

        response = self.client.chat.completions.create(
            model=settings.azure_openai_deployment,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": payload.text},
            ],
            temperature=0.4,
        )

        content = response.choices[0].message.content or ""

        title = "Adaptive Output"
        summary = ""
        transformed_text = content
        next_actions = []
        why_this_output = []

        current_section = None
        transformed_lines = []

        for raw_line in content.splitlines():
            line = raw_line.strip()
            if not line:
                if current_section == "TRANSFORMED_TEXT":
                    transformed_lines.append("")
                continue

            if line.startswith("TITLE:"):
                title = line.replace("TITLE:", "", 1).strip() or title
                current_section = None
            elif line.startswith("SUMMARY:"):
                summary = line.replace("SUMMARY:", "", 1).strip()
                current_section = "SUMMARY"
            elif line.startswith("TRANSFORMED_TEXT:"):
                current_section = "TRANSFORMED_TEXT"
            elif line.startswith("NEXT_ACTIONS:"):
                current_section = "NEXT_ACTIONS"
            elif line.startswith("WHY_THIS_OUTPUT:"):
                current_section = "WHY_THIS_OUTPUT"
            else:
                if current_section == "SUMMARY":
                    summary = f"{summary} {line}".strip()
                elif current_section == "TRANSFORMED_TEXT":
                    transformed_lines.append(raw_line)
                elif current_section == "NEXT_ACTIONS":
                    next_actions.append(line.lstrip("- ").strip())
                elif current_section == "WHY_THIS_OUTPUT":
                    why_this_output.append(line.lstrip("- ").strip())

        transformed_text = "\n".join(transformed_lines).strip() or content.strip()

        if not next_actions:
            next_actions = [
                "Review the generated output",
                "Pick the first recommended step",
                "Regenerate using another mode if needed",
            ]

        if not why_this_output:
            why_this_output = [
                f"Mode selected: {payload.mode}",
                f"Output style selected: {payload.preferences.output_style}",
                "The response was structured to reduce cognitive load",
            ]

        return AssistantResult(
            title=title,
            summary=summary or "Adaptive output generated with Azure OpenAI.",
            transformed_text=transformed_text,
            next_actions=next_actions,
            why_this_output=why_this_output,
            safety_passed=True,
            grounded_sources=[],
            used_services=["Azure OpenAI"],
        )