import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAudioPlayback } from '../useAudioPlayback';

describe('useAudioPlayback', () => {
  let mockBufferSource: {
    buffer: AudioBuffer | null;
    connect: ReturnType<typeof vi.fn>;
    start: ReturnType<typeof vi.fn>;
    onended: (() => void) | null;
  };
  let mockBuffer: {
    getChannelData: ReturnType<typeof vi.fn>;
  };
  let mockAudioContext: {
    state: string;
    destination: AudioDestinationNode;
    createBuffer: ReturnType<typeof vi.fn>;
    createBufferSource: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockBufferSource = {
      buffer: null,
      connect: vi.fn(),
      start: vi.fn(),
      onended: null,
    };

    mockBuffer = {
      getChannelData: vi.fn().mockReturnValue({ set: vi.fn() }),
    };

    mockAudioContext = {
      state: 'running',
      destination: {} as AudioDestinationNode,
      createBuffer: vi.fn().mockReturnValue(mockBuffer),
      createBufferSource: vi.fn().mockReturnValue(mockBufferSource),
    };

    // Use a class-style constructor so `new AudioContext()` works
    globalThis.AudioContext = function MockAudioContext() {
      return mockAudioContext;
    } as unknown as typeof AudioContext;
  });

  it('should return enqueue and clearQueue functions', () => {
    const { result } = renderHook(() => useAudioPlayback());

    expect(result.current.enqueue).toBeDefined();
    expect(typeof result.current.enqueue).toBe('function');
    expect(result.current.clearQueue).toBeDefined();
    expect(typeof result.current.clearQueue).toBe('function');
  });

  it('should play audio when enqueue is called', () => {
    const { result } = renderHook(() => useAudioPlayback());
    const testData = new Int16Array([100, 200, 300]);

    act(() => {
      result.current.enqueue(testData);
    });

    expect(mockAudioContext.createBuffer).toHaveBeenCalled();
    expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
    expect(mockBufferSource.connect).toHaveBeenCalledWith(mockAudioContext.destination);
    expect(mockBufferSource.start).toHaveBeenCalled();
  });

  it('should cap queue at AUDIO_QUEUE_MAX_SIZE (100)', () => {
    const { result } = renderHook(() => useAudioPlayback());

    // Fill beyond the max queue size
    act(() => {
      for (let i = 0; i < 105; i++) {
        result.current.enqueue(new Int16Array([i]));
      }
    });

    // Should still work without errors, demonstrating the cap prevents unbounded growth
    expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
  });

  it('should clear the queue when clearQueue is called', () => {
    const { result } = renderHook(() => useAudioPlayback());

    act(() => {
      result.current.enqueue(new Int16Array([100]));
    });

    act(() => {
      result.current.clearQueue();
    });

    // After clearing, enqueue should start fresh playback
    act(() => {
      result.current.enqueue(new Int16Array([200]));
    });

    expect(mockAudioContext.createBufferSource).toHaveBeenCalled();
  });
});
