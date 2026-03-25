from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = Field(default="NeuroAssistant AI API", alias="APP_NAME")
    app_env: str = Field(default="development", alias="APP_ENV")
    app_debug: bool = Field(default=True, alias="APP_DEBUG")
    api_v1_prefix: str = Field(default="/api/v1", alias="API_V1_PREFIX")
    cors_origins: str = Field(default="http://localhost:5173", alias="CORS_ORIGINS")

    use_mock_ai: bool = Field(default=True, alias="USE_MOCK_AI")

    azure_openai_endpoint: str | None = Field(default=None, alias="AZURE_OPENAI_ENDPOINT")
    azure_openai_api_key: str | None = Field(default=None, alias="AZURE_OPENAI_API_KEY")
    azure_openai_deployment: str | None = Field(default=None, alias="AZURE_OPENAI_DEPLOYMENT")
    azure_openai_api_version: str = Field(default="2024-10-21", alias="AZURE_OPENAI_API_VERSION")

    azure_search_endpoint: str | None = Field(default=None, alias="AZURE_SEARCH_ENDPOINT")
    azure_search_api_key: str | None = Field(default=None, alias="AZURE_SEARCH_API_KEY")
    azure_search_index: str | None = Field(default=None, alias="AZURE_SEARCH_INDEX")

    azure_blob_connection_string: str | None = Field(default=None, alias="AZURE_BLOB_CONNECTION_STRING")
    azure_blob_container: str = Field(default="neuroassistant-exports", alias="AZURE_BLOB_CONTAINER")

    azure_content_safety_endpoint: str | None = Field(default=None, alias="AZURE_CONTENT_SAFETY_ENDPOINT")
    azure_content_safety_api_key: str | None = Field(default=None, alias="AZURE_CONTENT_SAFETY_API_KEY")


settings = Settings()
