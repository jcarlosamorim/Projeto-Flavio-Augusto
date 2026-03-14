import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudioCapture } from '../useAudioCapture';

describe('useAudioCapture', () => {
  let mockTrack: { stop: ReturnType<typeof vi.fn> };
  let mockStream: { getTracks: ReturnType<typeof vi.fn> };
  let mockProcessor: {
    onaudioprocess: ((e: AudioProcessingEvent) => void) | null;
    connect: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
  };
  let mockSource: { connect: ReturnType<typeof vi.fn> };
  let mockAudioContext: {
    createMediaStreamSource: ReturnType<typeof vi.fn>;
    createScriptProcessor: ReturnType<typeof vi.fn>;
    close: ReturnType<typeof vi.fn>;
    destination: AudioDestinationNode;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockTrack = { stop: vi.fn() };
    mockStream = { getTracks: vi.fn().mockReturnValue([mockTrack]) };

    mockProcessor = {
      onaudioprocess: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    };

    mockSource = { connect: vi.fn() };

    mockAudioContext = {
      createMediaStreamSource: vi.fn().mockReturnValue(mockSource),
      createScriptProcessor: vi.fn().mockReturnValue(mockProcessor),
      close: vi.fn(),
      destination: {} as AudioDestinationNode,
    };

    // Use a class-style constructor so `new AudioContext()` works
    globalThis.AudioContext = function MockAudioContext() {
      return mockAudioContext;
    } as unknown as typeof AudioContext;

    Object.defineProperty(globalThis.navigator, 'mediaDevices', {
      value: {
        getUserMedia: vi.fn().mockResolvedValue(mockStream),
      },
      writable: true,
      configurable: true,
    });
  });

  it('should return startCapture and stopCapture functions', () => {
    const { result } = renderHook(() => useAudioCapture());

    expect(result.current.startCapture).toBeDefined();
    expect(typeof result.current.startCapture).toBe('function');
    expect(result.current.stopCapture).toBeDefined();
    expect(typeof result.current.stopCapture).toBe('function');
  });

  it('should request microphone access and create AudioContext on startCapture', async () => {
    const { result } = renderHook(() => useAudioCapture());
    const onAudioData = vi.fn();

    await act(async () => {
      await result.current.startCapture(onAudioData);
    });

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(mockAudioContext.createMediaStreamSource).toHaveBeenCalledWith(mockStream);
    expect(mockAudioContext.createScriptProcessor).toHaveBeenCalled();
    expect(mockSource.connect).toHaveBeenCalledWith(mockProcessor);
    expect(mockProcessor.connect).toHaveBeenCalledWith(mockAudioContext.destination);
  });

  it('should stop all tracks and close AudioContext on stopCapture', async () => {
    const { result } = renderHook(() => useAudioCapture());
    const onAudioData = vi.fn();

    await act(async () => {
      await result.current.startCapture(onAudioData);
    });

    act(() => {
      result.current.stopCapture();
    });

    expect(mockTrack.stop).toHaveBeenCalled();
    expect(mockProcessor.disconnect).toHaveBeenCalled();
    expect(mockAudioContext.close).toHaveBeenCalled();
  });
});
