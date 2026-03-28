import logging

from app.core.config import settings
from app.schemas.assistant import AssistantRequest, AssistantResponse
from app.services.azure_content_safety_service import AzureContentSafetyService
from app.services.azure_openai_service import AzureOpenAIService
from app.services.azure_search_service import AzureSearchService
from app.services.mock_ai_service import MockAIService

logger = logging.getLogger(__name__)


class AssistantOrchestrator:
    def __init__(self) -> None:
        self.safety = AzureContentSafetyService()
        self.search = AzureSearchService()

    def run(self, payload: AssistantRequest) -> AssistantResponse:
        # 1) Safety
        try:
            safety_ok = self.safety.analyze_text(payload.text)
        except Exception as exc:
            logger.exception("Safety check failed, defaulting to safe=False fallback: %s", exc)
            safety_ok = False

        # 2) AI generation
        try:
            if settings.use_mock_ai:
                result = MockAIService().generate(payload)
            else:
                try:
                    result = AzureOpenAIService().generate(payload)
                except Exception as exc:
                    logger.exception("Azure OpenAI failed, falling back to Mock AI: %s", exc)
                    result = MockAIService().generate(payload)
        except Exception as exc:
            logger.exception("AI generation failed completely: %s", exc)
            raise

        # 3) Search grounding
        try:
            result.grounded_sources = self.search.retrieve_context(payload.text)
        except Exception as exc:
            logger.exception("Search grounding failed, using fallback context: %s", exc)
            result.grounded_sources = ["Fallback context in use"]

        # 4) Final metadata
        result.safety_passed = safety_ok

        if settings.use_mock_ai:
            result.used_services = [
                "Mock AI",
                "Azure Content Safety",
                "Azure AI Search-ready layer",
                "Azure Blob-ready layer",
            ]
        else:
            if "Azure OpenAI" not in result.used_services:
                result.used_services.insert(0, "Azure OpenAI")
            if "Azure Content Safety" not in result.used_services:
                result.used_services.append("Azure Content Safety")

        return AssistantResponse(success=True, result=result)