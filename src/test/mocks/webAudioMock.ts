import { vi } from 'vitest';

export function createMockAudioContext() {
  const mockDestination = {} as AudioDestinationNode;

  const mockBufferSource = {
    buffer: null as AudioBuffer | null,
    connect: vi.fn(),
    start: vi.fn(),
    onended: null as (() => void) | null,
  };

  const mockScriptProcessor = {
    onaudioprocess: null as ((e: AudioProcessingEvent) => void) | null,
    connect: vi.fn(),
    disconnect: vi.fn(),
  };

  const mockMediaStreamSource = {
    connect: vi.fn(),
  };

  const mockBuffer = {
    getChannelData: vi.fn().mockReturnValue({
      set: vi.fn(),
    }),
  };

  const mockAudioContext = {
    sampleRate: 16000,
    state: 'running' as AudioContextState,
    destination: mockDestination,
    createMediaStreamSource: vi.fn().mockReturnValue(mockMediaStreamSource),
    createScriptProcessor: vi.fn().mockReturnValue(mockScriptProcessor),
    createBuffer: vi.fn().mockReturnValue(mockBuffer),
    createBufferSource: vi.fn().mockReturnValue(mockBufferSource),
    close: vi.fn(),
  };

  return {
    mockAudioContext,
    mockScriptProcessor,
    mockMediaStreamSource,
    mockBufferSource,
    mockBuffer,
  };
}

export function createMockMediaStream() {
  const mockTrack = {
    stop: vi.fn(),
    kind: 'audio' as const,
    id: 'mock-track-id',
  };

  const mockStream = {
    getTracks: vi.fn().mockReturnValue([mockTrack]),
    getAudioTracks: vi.fn().mockReturnValue([mockTrack]),
  };

  return { mockStream, mockTrack };
}

export function setupWebAudioMocks() {
  const { mockAudioContext, mockScriptProcessor, mockMediaStreamSource, mockBufferSource, mockBuffer } =
    createMockAudioContext();
  const { mockStream, mockTrack } = createMockMediaStream();

  const AudioContextMock = vi.fn().mockImplementation(() => mockAudioContext);

  Object.defineProperty(globalThis, 'AudioContext', {
    value: AudioContextMock,
    writable: true,
    configurable: true,
  });

  Object.defineProperty(globalThis.navigator, 'mediaDevices', {
    value: {
      getUserMedia: vi.fn().mockResolvedValue(mockStream),
    },
    writable: true,
    configurable: true,
  });

  return {
    AudioContextMock,
    mockAudioContext,
    mockScriptProcessor,
    mockMediaStreamSource,
    mockBufferSource,
    mockBuffer,
    mockStream,
    mockTrack,
  };
}
