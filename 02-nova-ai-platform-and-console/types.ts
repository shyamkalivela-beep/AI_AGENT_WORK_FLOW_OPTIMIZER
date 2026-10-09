/**
 * Nova AI — Core TypeScript Interfaces & Schema Definitions
 */

export interface AgentConfig {
  id: string;
  name: string;
  version: string;
  model: 'gemini-1.5-pro' | 'claude-3-5-sonnet' | 'gpt-4o' | 'deepseek-r1';
  temperature: number;
  systemPrompt: string;
  tools: ToolDefinition[];
  memoryEnabled: boolean;
  sandboxMode: 'firecracker-microvm' | 'isolated-process' | 'wasm';
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  timeoutMs: number;
  requiresConfirmation: boolean;
}

export interface ToolExecutionEvent {
  toolName: string;
  inputPayload: Record<string, unknown>;
  outputPayload: string | Record<string, unknown>;
  latencyMs: number;
  statusCode: number;
  executedAt: string;
}

export interface ReasoningStep {
  stepIndex: number;
  thought: string;
  action?: string;
  observation?: string;
}

export interface WorkflowExecutionTrace {
  sessionId: string;
  agentId: string;
  prompt: string;
  reasoningTrace: ReasoningStep[];
  toolCalls: ToolExecutionEvent[];
  finalResponse: string;
  telemetry: TelemetryMetrics;
}

export interface TelemetryMetrics {
  routingLatencyMs: number;
  toolLatencyMs: number;
  generationLatencyMs: number;
  tokens: {
    prompt: number;
    completion: number;
    cached: number;
    total: number;
  };
  costUsd: number;
}

export interface VectorMemoryFragment {
  id: string;
  tag: string;
  similarityScore: number;
  content: string;
  timestamp: string;
}
