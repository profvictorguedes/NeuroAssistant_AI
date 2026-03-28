import logging

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


class AzureSearchService:
    def retrieve_context(self, query: str) -> list[str]:
        if not all([
            settings.azure_search_endpoint,
            settings.azure_search_api_key,
            settings.azure_search_index,
        ]):
            logger.warning("Azure AI Search not configured — returning fallback context.")
            return [
                "Use chunked explanations for improved readability.",
                "Prefer step-by-step tasks for executive function support.",
            ]

        url = (
            f"{settings.azure_search_endpoint}/indexes/"
            f"{settings.azure_search_index}/docs/search?api-version=2023-11-01"
        )

        headers = {
            "Content-Type": "application/json",
            "api-key": settings.azure_search_api_key,
        }

        payload = {
            "search": query,
            "top": 3,
            "select": "content",
        }

        try:
            response = httpx.post(url, headers=headers, json=payload, timeout=10.0)
            response.raise_for_status()

            data = response.json()
            values = data.get("value", [])

            contexts = []
            for item in values:
                content = item.get("content")
                if content:
                    contexts.append(content)

            if not contexts:
                return [
                    "Use chunked explanations for improved readability.",
                    "Prefer step-by-step tasks for executive function support.",
                ]

            return contexts

        except Exception as exc:
            logger.error("Azure AI Search error: %s — returning fallback context.", exc)
            return [
                "Use chunked explanations for improved readability.",
                "Prefer step-by-step tasks for executive function support.",
            ]