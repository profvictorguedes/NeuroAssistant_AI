from app.schemas.assistant import AssistantRequest, AssistantResult


class MockAIService:
    def generate(self, payload: AssistantRequest) -> AssistantResult:
        text = payload.text.strip()

        if payload.mode == "simplify":
            transformed = (
                "Main idea:\n"
                f"{text[:220]}...\n\n"
                "Simplified version:\n"
                "- This is asking you to do several things.\n"
                "- The most important step is to begin with one small action.\n"
                "- Ignore lower-priority details until the first task is started."
            )
            title = "Simplified Explanation"

        elif payload.mode == "prioritize":
            transformed = (
                "Priority order:\n"
                "1. Do the urgent item first.\n"
                "2. Remove low-value or optional work.\n"
                "3. Complete one meaningful step before switching tasks.\n"
                "4. Review only what is needed for the deadline."
            )
            title = "Priority Plan"

        elif payload.mode == "study":
            transformed = (
                "Summary:\n"
                "- This topic can be learned in smaller pieces.\n\n"
                "Key points:\n"
                "- Point 1\n"
                "- Point 2\n"
                "- Point 3\n\n"
                "Quiz questions:\n"
                "- What is the main concept?\n"
                "- Why is it important?\n"
                "- How would you explain it simply?\n\n"
                "Next study step:\n"
                "- Review the first concept for 10 focused minutes."
            )
            title = "Study Support"

        elif payload.mode == "focus":
            transformed = (
                "Focus plan:\n"
                "- One next action: start the first concrete sub-task.\n"
                "- Time block: 15 minutes.\n"
                "- Remove unrelated tabs and tools.\n"
                "- Do not optimize yet; just start."
            )
            title = "Focus Mode"

        elif payload.mode == "calm":
            transformed = (
                "Calm support:\n"
                "- You do not need to solve everything now.\n"
                "- Start with the smallest useful action.\n"
                "- After that, pause and reassess.\n"
                "- Progress matters more than perfection."
            )
            title = "Calm Guidance"

        else:
            transformed = (
                "Task breakdown:\n"
                "1. Understand the goal.\n"
                "2. Split it into 5 smaller tasks.\n"
                "3. Start with the easiest useful step.\n"
                "4. Validate progress.\n"
                "5. Package the final result."
            )
            title = "Step-by-Step Breakdown"

        return AssistantResult(
            title=title,
            summary=f"Generated in {payload.mode} mode.",
            transformed_text=transformed,
            next_actions=[
                "Review the result",
                "Try another mode to compare outputs",
                "Export the preferred version",
            ],
            why_this_output=[
                f"Mode selected: {payload.mode}",
                f"Output style: {payload.preferences.output_style}",
                "The output was restructured to reduce cognitive load",
            ],
            safety_passed=True,
            grounded_sources=[],
            used_services=["Mock AI"],
        )