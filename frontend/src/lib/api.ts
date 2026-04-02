import axios from "axios";
import type { AssistantRequest, AssistantResponse } from "../types/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
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

export async function exportSessionToBlob(payload: {
  container: string;
  folder?: string;
  filename: string;
  input_text: string;
  output_text: string;
  mode: string;
  preferences: Record<string, unknown>;
}) {
  const { data } = await client.post("/files/blob/export-session", payload);
  return data;
}

export async function listBlobSessions(payload: {
  container: string;
  folder?: string;
}) {
  const { data } = await client.post("/files/blob/list", payload);
  return data;
}

export async function importSessionFromBlob(payload: {
  container: string;
  blob_name: string;
}) {
  const { data } = await client.post("/files/blob/import-session", payload);
  return data;
}

export async function downloadWordFile(payload: {
  filename: string;
  input_text: string;
  output_text: string;
}) {
  const response = await client.post("/files/word/download", payload, {
    responseType: "blob",
  });
  return response.data as Blob;
}