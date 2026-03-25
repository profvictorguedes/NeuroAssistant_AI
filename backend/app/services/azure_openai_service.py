from app.core.config import settings
from app.core.exceptions import ServiceError
from app.schemas.assistant import AssistantRequest, AssistantResult


class AzureOpenAIService:
    def generate(self, payload: AssistantRequest) -> AssistantResult:
        if not all([
            settings.azure_openai_endpoint,
            settings.azure_openai_api_key,
            settings.azure_openai_deployment,
        ]):
            raise ServiceError("Azure OpenAI is not configured yet.")

        # Real Azure OpenAI integration goes here.
        # Keep interface stable for later replacement.
        raise ServiceError("Azure OpenAI integration not implemented yet.")