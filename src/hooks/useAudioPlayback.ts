import { useRef, useCallback } from 'react';
import { AUDIO_PLAYBACK_SAMPLE_RATE, AUDIO_QUEUE_MAX_SIZE } from '../config';

export function useAudioPlayback() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueue = useRef<Int16Array[]>([]);
  const isPlaying = useRef(false);

  const playNextInQueue = useCallback(() => {
    if (audioQueue.current.length === 0) {
      isPlaying.current = false;
      return;
    }

    isPlaying.current = true;
    const pcmData = audioQueue.current.shift()!;

    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new AudioContext({ sampleRate: AUDIO_PLAYBACK_SAMPLE_RATE });
    }

    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      floatData[i] = pcmData[i] / 0x7FFF;
    }

    const buffer = audioContextRef.current.createBuffer(1, floatData.length, AUDIO_PLAYBACK_SAMPLE_RATE);
    buffer.getChannelData(0).set(floatData);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.onended = playNextInQueue;
    source.start();
  }, []);

  const enqueue = useCallback((data: Int16Array) => {
    if (audioQueue.current.length >= AUDIO_QUEUE_MAX_SIZE) {
      audioQueue.current.shift();
    }
    audioQueue.current.push(data);
    if (!isPlaying.current) playNextInQueue();
  }, [playNextInQueue]);

  const clearQueue = useCallback(() => {
    audioQueue.current = [];
    isPlaying.current = false;
  }, []);

  return { enqueue, clearQueue };
}
