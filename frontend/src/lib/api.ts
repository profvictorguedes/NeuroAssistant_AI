import axios from "axios";
import type { AssistantRequest, AssistantResponse } from "../types/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

export async function transformContent(
  payload: AssistantRequest
): Promise<AssistantResponse> {
  const { data } = await client.post<AssistantResponse>(
    "/assistant/transform",
    payload
  );
  return data;
}

export async function exportMarkdown(filename: string, content: string) {
  const { data } = await client.post("/files/export", { filename, content });
  return data;
}