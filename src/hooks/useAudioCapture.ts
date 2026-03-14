import { useRef, useCallback } from 'react';
import { AUDIO_CAPTURE_SAMPLE_RATE, AUDIO_BUFFER_SIZE } from '../config';

export function useAudioCapture() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCapture = useCallback(async (onAudioData: (base64Data: string) => void) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const audioContext = new AudioContext({ sampleRate: AUDIO_CAPTURE_SAMPLE_RATE });
    audioContextRef.current = audioContext;

    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(AUDIO_BUFFER_SIZE, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmData = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
      }

      const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
      onAudioData(base64Data);
    };

    source.connect(processor);
    processor.connect(audioContext.destination);
  }, []);

  const stopCapture = useCallback(() => {
    streamRef.current?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    processorRef.current?.disconnect();
    audioContextRef.current?.close();
    streamRef.current = null;
    processorRef.current = null;
    audioContextRef.current = null;
  }, []);

  return { startCapture, stopCapture };
}
