def chunk_text(text: str, size: int = 400) -> list[str]:
    words = text.split()
    chunks = [] 
    current = []

    for word in words:
        current.append(word)
        if len(" ".join(current)) >= size:
            chunks.append(" ".join(current))
            current = []

    if current: 
        chunks.append(" ".join(current))

    return chunks