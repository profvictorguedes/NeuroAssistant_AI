import logging
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

_FALLBACK_CONTEXT = [
    "Use chunked explanations for improved readability.",
    "Prefer step-by-step tasks for executive function support.",
]


class AzureSearchService:
    def retrieve_context(self, query: str) -> list[str]:
        if not all([
            settings.azure_search_endpoint,
            settings.azure_search_api_key,
            settings.azure_search_index,
        ]):
            logger.warning("Azure AI Search not configured — returning fallback context.")
            return _FALLBACK_CONTEXT

        try:
            url = (
                f"{settings.azure_search_endpoint.rstrip('/')}"
                f"/indexes/{settings.azure_search_index}/docs/search"
                "?api-version=2023-11-01"
            )
            headers = {
                "api-key": settings.azure_search_api_key,
                "Content-Type": "application/json",
            }
            body = {"search": query, "top": 3, "queryType": "simple"}

            with httpx.Client(timeout=10) as client:
                response = client.post(url, headers=headers, json=body)
                response.raise_for_status()

            results = []
            for doc in response.json().get("value", []):
                content = (
                    doc.get("content")
                    or doc.get("text")
                    or doc.get("chunk")
                    or str(doc)
                )
                results.append(str(content)[:500])

            return results if results else _FALLBACK_CONTEXT

        except Exception as exc:
            logger.error("Azure AI Search error: %s — returning fallback context.", exc)
            return _FALLBACK_CONTEXT