export type AssistantMode =
  | "simplify"
  | "prioritize"
  | "study"
  | "focus"
  | "calm"
  | "task_breakdown";

export type OutputStyle = "concise" | "balanced" | "detailed";

export interface Preferences {
  output_style: OutputStyle;
  visual_chunking: boolean;
  bullet_steps: boolean;
  calming_tone: boolean;
  deadline_aware: boolean;
  beginner_friendly: boolean;
}

export interface AssistantRequest {
  mode: AssistantMode;
  text: string;
  preferences: Preferences;
}

export interface AssistantResult {
  title: string;
  summary: string;
  transformed_text: string;
  next_actions: string[];
  why_this_output: string[];
  safety_passed: boolean;
  grounded_sources: string[];
  used_services: string[];
}

export interface AssistantResponse {
  success: boolean;
  result: AssistantResult;
}