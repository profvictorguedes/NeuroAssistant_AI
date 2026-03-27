from app.core.config import settings
from app.core.exceptions import ServiceError
from app.schemas.assistant import AssistantRequest, AssistantResponse
from app.services.azure_content_safety_service import AzureContentSafetyService
from app.services.azure_openai_service import AzureOpenAIService
from app.services.azure_search_service import AzureSearchService
from app.services.mock_ai_services import MockAIService


class AssistantOrchestrator:
    def __init__(self) -> None:
        self.safety = AzureContentSafetyService()
        self.search = AzureSearchService()
        self.ai = MockAIService() if settings.use_mock_ai else AzureOpenAIService()

    def run(self, payload: AssistantRequest) -> AssistantResponse:
        safety_ok = self.safety.analyze_text(payload.text)

        if not safety_ok:
            raise ServiceError("Content blocked by the safety filter. Please revise your input.")

        # Retrieve context first so it can be passed to the AI for grounding
        context = self.search.retrieve_context(payload.text)
        result = self.ai.generate(payload, context=context)

        result.safety_passed = safety_ok
        result.grounded_sources = context

        if settings.use_mock_ai:
            result.used_services = [
                "Mock AI",
                "Azure AI Search (fallback)",
                "Azure Content Safety (fallback)",
                "Azure Blob Storage (fallback)",
            ]
        else:
            result.used_services = [
                "Azure OpenAI",
                "Azure AI Search",
                "Azure Content Safety",
                "Azure Blob Storage",
            ]

        return AssistantResponse(success=True, result=result)
