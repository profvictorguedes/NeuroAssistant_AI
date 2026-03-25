from app.schemas.assistant import AssistantRequest, AssistantResult


class MockAIService:
    def generate(self, payload: AssistantRequest) -> AssistantResult:
        text = payload.text.strip()

        if payload.mode == "simplify":
            transformed = (
                "Simplified version:\n\n"
                f"- Main idea: {text[:180]}...\n"
                "- Key takeaway: This content has been reduced into clearer, easier language.\n"
                "- Action: Read one section at a time and focus on the highest-priority point first."
            )
            title = "Simplified Explanation"

        elif payload.mode == "prioritize":
            transformed = (
                "Priority Plan:\n\n"
                "1. Do the most urgent step first.\n"
                "2. Remove anything non-essential.\n"
                "3. Finish one action before switching.\n"
                "4. Review progress at the end."
            )
            title = "Priority-First Plan"

        elif payload.mode == "study":
            transformed = (
                "Study Support:\n\n"
                "Summary:\n- This topic can be learned in smaller chunks.\n\n"
                "Key Points:\n- Point 1\n- Point 2\n- Point 3\n\n"
                "Quiz:\n- What is the main concept?\n- Why does it matter?\n\n"
                "Next Step:\n- Review the first concept for 10 minutes."
            )
            title = "Study Mode Output"

        elif payload.mode == "focus":
            transformed = (
                "Focus Support:\n\n"
                "- One next step: Open the required file and complete the first paragraph.\n"
                "- Time block: 15 minutes.\n"
                "- Distraction rule: Keep only one tab open."
            )
            title = "Focus Plan"

        elif payload.mode == "calm":
            transformed = (
                "Calm Mode:\n\n"
                "- You do not need to do everything now.\n"
                "- Start with the smallest useful step.\n"
                "- Pause after one small task and reassess."
            )
            title = "Calm Guidance"

        else:
            transformed = (
                "Task Breakdown:\n\n"
                "1. Understand the goal.\n"
                "2. Split into 3–5 sub-tasks.\n"
                "3. Complete the easiest sub-task first.\n"
                "4. Validate the result.\n"
                "5. Package the final output."
            )
            title = "Step-by-Step Task Breakdown"

        return AssistantResult(
            title=title,
            summary="Adaptive output generated in mock mode for the hackathon PoC.",
            transformed_text=transformed,
            next_actions=[
                "Review the transformed result",
                "Select a different mode to compare outputs",
                "Export the result for later use",
            ],
            why_this_output=[
                f"Mode selected: {payload.mode}",
                f"Output style: {payload.preferences.output_style}",
                "The content was restructured to reduce cognitive load",
            ],
            safety_passed=True,
            grounded_sources=[
                "Accessibility playbook",
                "Neurodiversity-friendly productivity heuristics",
            ],
            used_services=["mock_ai", "mock_search", "mock_safety"],
        )
