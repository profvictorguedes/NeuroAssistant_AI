import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

_BANNED_TERMS = ["self-harm instruction", "violent instruction"]


class AzureContentSafetyService:
    def analyze_text(self, text: str) -> bool:
        if not settings.azure_content_safety_endpoint or not settings.azure_content_safety_api_key:
            logger.warning("Azure Content Safety not configured — using keyword fallback.")
            return self._keyword_check(text)

        try:
            from azure.ai.contentsafety import ContentSafetyClient
            from azure.ai.contentsafety.models import AnalyzeTextOptions
            from azure.core.credentials import AzureKeyCredential

            client = ContentSafetyClient(
                endpoint=settings.azure_content_safety_endpoint,
                credential=AzureKeyCredential(settings.azure_content_safety_api_key),
            )
            response = client.analyze_text(AnalyzeTextOptions(text=text[:10000]))

            for item in response.categories_analysis:
                if item.severity >= 4:
                    logger.info(
                        "Content Safety blocked category '%s' at severity %d.",
                        item.category,
                        item.severity,
                    )
                    return False
            return True

        except Exception as exc:
            logger.error("Azure Content Safety error: %s — falling back to keyword check.", exc)
            return self._keyword_check(text)

    @staticmethod
    def _keyword_check(text: str) -> bool:
        lowered = text.lower()
        return not any(term in lowered for term in _BANNED_TERMS)