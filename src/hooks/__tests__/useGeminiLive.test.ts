import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGeminiLive } from '../useGeminiLive';
import { DEFAULT_METRICS } from '../../config';

// Mock the sub-hooks
const mockStartCapture = vi.fn();
const mockStopCapture = vi.fn();
const mockEnqueue = vi.fn();
const mockClearQueue = vi.fn();

vi.mock('../useAudioCapture', () => ({
  useAudioCapture: () => ({
    startCapture: mockStartCapture,
    stopCapture: mockStopCapture,
  }),
}));

vi.mock('../useAudioPlayback', () => ({
  useAudioPlayback: () => ({
    enqueue: mockEnqueue,
    clearQueue: mockClearQueue,
  }),
}));

// Mock GoogleGenAI
const mockClose = vi.fn();
const mockSendRealtimeInput = vi.fn();
const mockSendToolResponse = vi.fn();

const mockSession = {
  close: mockClose,
  sendRealtimeInput: mockSendRealtimeInput,
  sendToolResponse: mockSendToolResponse,
};

const mockLiveConnect = vi.fn().mockResolvedValue(mockSession);

vi.mock('@google/genai', () => ({
  GoogleGenAI: class MockGoogleGenAI {
    live = {
      connect: mockLiveConnect,
    };
  },
  Modality: { AUDIO: 'AUDIO' },
  Type: { OBJECT: 'OBJECT', NUMBER: 'NUMBER', STRING: 'STRING' },
}));

// Mock getUserMedia for mic pre-check
const mockGetUserMedia = vi.fn().mockResolvedValue({
  getTracks: () => [{ stop: vi.fn() }],
});

Object.defineProperty(navigator, 'mediaDevices', {
  value: { getUserMedia: mockGetUserMedia },
  writable: true,
});

describe('useGeminiLive', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLiveConnect.mockResolvedValue(mockSession);
    mockGetUserMedia.mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    });
  });

  it('should return initial state with idle connectionState and default metrics', () => {
    const { result } = renderHook(() => useGeminiLive());

    expect(result.current.connectionState).toBe('idle');
    expect(result.current.isSpeaking).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.metrics).toEqual({ ...DEFAULT_METRICS });
    expect(typeof result.current.connect).toBe('function');
    expect(typeof result.current.disconnect).toBe('function');
    expect(typeof result.current.resetMetrics).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
  });

  it('should call GoogleGenAI live.connect when connect is called', async () => {
    const { result } = renderHook(() => useGeminiLive());

    const product = { name: 'Test Product', description: 'A great product', price: '99.00' };

    await act(async () => {
      await result.current.connect(product);
    });

    expect(mockLiveConnect).toHaveBeenCalledTimes(1);
    const connectArgs = mockLiveConnect.mock.calls[0][0];
    expect(connectArgs.config.systemInstruction).toContain('Test Product');
    expect(connectArgs.config.systemInstruction).toContain('A great product');
    expect(connectArgs.config.systemInstruction).toContain('99.00');
  });

  it('should stop capture and close session on disconnect', async () => {
    const { result } = renderHook(() => useGeminiLive());

    const product = { name: 'Test', description: 'Desc', price: '10' };

    await act(async () => {
      await result.current.connect(product);
    });

    act(() => {
      result.current.disconnect();
    });

    expect(mockClose).toHaveBeenCalled();
    expect(mockStopCapture).toHaveBeenCalled();
    expect(result.current.connectionState).toBe('idle');
  });

  it('should set error state when connect fails', async () => {
    mockLiveConnect.mockRejectedValueOnce(new Error('API key invalid'));
    const { result } = renderHook(() => useGeminiLive());

    const product = { name: 'Test', description: 'Desc', price: '10' };

    await act(async () => {
      await result.current.connect(product);
    });

    expect(result.current.connectionState).toBe('error');
    expect(result.current.error).toBe('API key invalid');
  });

  it('should set MIC_DENIED error when mic permission is denied', async () => {
    const notAllowed = new DOMException('Permission denied', 'NotAllowedError');
    mockGetUserMedia.mockRejectedValueOnce(notAllowed);
    const { result } = renderHook(() => useGeminiLive());

    await act(async () => {
      await result.current.connect({ name: 'T', description: 'D', price: '1' });
    });

    expect(result.current.connectionState).toBe('error');
    expect(result.current.error).toBe('MIC_DENIED');
    expect(mockLiveConnect).not.toHaveBeenCalled();
  });

  it('should clear error and reset to idle when clearError is called', async () => {
    mockLiveConnect.mockRejectedValueOnce(new Error('API key invalid'));
    const { result } = renderHook(() => useGeminiLive());

    await act(async () => {
      await result.current.connect({ name: 'T', description: 'D', price: '1' });
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.connectionState).toBe('idle');
    expect(result.current.error).toBeNull();
  });

  it('should reset metrics to defaults when resetMetrics is called', () => {
    const { result } = renderHook(() => useGeminiLive());

    act(() => {
      result.current.resetMetrics();
    });

    expect(result.current.metrics).toEqual({ ...DEFAULT_METRICS });
  });
});
