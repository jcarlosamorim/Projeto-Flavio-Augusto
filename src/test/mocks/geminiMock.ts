import { vi } from 'vitest';

export function createMockSession() {
  return {
    sendRealtimeInput: vi.fn(),
    sendToolResponse: vi.fn(),
    close: vi.fn(),
  };
}

export function createMockGoogleGenAI() {
  const mockSession = createMockSession();

  const mockAI = {
    live: {
      connect: vi.fn().mockResolvedValue(mockSession),
    },
  };

  return { mockAI, mockSession };
}

export function setupGeminiMock() {
  const { mockAI, mockSession } = createMockGoogleGenAI();

  const GoogleGenAIMock = vi.fn().mockImplementation(() => mockAI);

  return { GoogleGenAIMock, mockAI, mockSession };
}
