class AzureContentSafetyService:
    def analyze_text(self, text: str) -> bool:
        # Later connect Azure Content Safety here
        banned = ["self-harm instruction", "violent instruction"]
        lowered = text.lower()
        return not any(term in lowered for term in banned)