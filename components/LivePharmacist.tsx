import React, { useEffect, useRef, useState } from 'react';
import { connectLiveSession } from '../services/genai';
import { Mic, MicOff, Volume2, X } from 'lucide-react';

interface LivePharmacistProps {
  onClose: () => void;
}

// Audio helpers
function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return {
    data: base64,
    mimeType: 'audio/pcm;rate=16000',
  };
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LivePharmacist: React.FC<LivePharmacistProps> = ({ onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState<string | null>(null);
  
  // Refs for audio handling
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    let cleanup = false;

    const startSession = async () => {
      try {
        // Initialize Audio Contexts
        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        // Get Microphone
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

        const sessionPromise = connectLiveSession(
          () => {
             if (cleanup) return;
             setIsConnected(true);
             setStatus('Connected. Speak now.');
             
             // Setup Input Stream
             if (!inputAudioContextRef.current || !streamRef.current) return;
             
             sourceRef.current = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
             processorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
             
             processorRef.current.onaudioprocess = (e) => {
               const inputData = e.inputBuffer.getChannelData(0);
               const pcmBlob = createBlob(inputData);
               sessionPromise.then(session => {
                 session.sendRealtimeInput({ media: pcmBlob });
               });
             };
             
             sourceRef.current.connect(processorRef.current);
             processorRef.current.connect(inputAudioContextRef.current.destination);
          },
          async (message) => {
             if (cleanup) return;
             
             const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (base64Audio && outputAudioContextRef.current) {
                const ctx = outputAudioContextRef.current;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                
                const audioBuffer = await decodeAudioData(
                  decode(base64Audio),
                  ctx,
                  24000,
                  1
                );
                
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
             }
          },
          () => {
            if (!cleanup) setStatus('Session closed');
          },
          (err) => {
            console.error(err);
            if (!cleanup) setError('Connection error occurred');
          }
        );
        
        sessionRef.current = sessionPromise;
      } catch (err: any) {
        setError(err.message || "Failed to start audio session");
      }
    };

    startSession();

    return () => {
      cleanup = true;
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (inputAudioContextRef.current) inputAudioContextRef.current.close();
      if (outputAudioContextRef.current) outputAudioContextRef.current.close();
      if (sessionRef.current) {
        sessionRef.current.then((s: any) => s.close && s.close());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl animate-fade-in">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
        
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Volume2 className="w-10 h-10 text-pink-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Live Pharmacist</h2>
          <p className="text-gray-500 mb-8 h-6">{error ? <span className="text-red-500">{error}</span> : status}</p>
          
          <div className="flex gap-4">
             <div className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 ${isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
               <Mic className="w-5 h-5" />
               {isConnected ? 'Listening' : 'Connecting...'}
             </div>
          </div>
          
          <p className="mt-8 text-xs text-gray-400">Powered by Gemini 2.5 Native Audio</p>
        </div>
      </div>
    </div>
  );
};

export default LivePharmacist;
