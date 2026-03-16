import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { type RolePlay } from "../types";

export class GeminiLiveService {
  private ai: GoogleGenAI;
  private session: any;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private audioQueue: Int16Array[] = [];
  private isPlaying = false;
  private nextStartTime = 0;
  private activeSources: AudioBufferSourceNode[] = [];

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing from environment variables.");
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey || "" });
  }

  async connect(callbacks: {
    onAudioData: (data: Int16Array) => void;
    onTextData: (text: string) => void;
    onError: (error: any) => void;
    onClose: () => void;
    rolePlay?: RolePlay;
  }) {
    try {
      this.audioContext = new AudioContext({ sampleRate: 16000 });
      this.nextStartTime = 0;
      
      this.session = await this.ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        callbacks: {
          onopen: () => {
            console.log("Gemini Live connected");
          },
          onmessage: async (message: LiveServerMessage) => {
            const parts = message.serverContent?.modelTurn?.parts;
            if (parts) {
              for (const part of parts) {
                if (part.inlineData?.data) {
                  const base64Data = part.inlineData.data;
                  const audioData = this.base64ToUint8Array(base64Data);
                  const int16Data = new Int16Array(audioData.buffer);
                  callbacks.onAudioData(int16Data);
                  this.playAudio(int16Data);
                }
                if (part.text) {
                  callbacks.onTextData(part.text);
                }
              }
            }

            if (message.serverContent?.interrupted) {
              this.stopAudio();
            }
          },
          onerror: (error) => {
            console.error("Gemini Live Error:", error);
            let message = "A network error occurred while connecting to the AI tutor.";
            if (error?.message?.includes("API key")) {
              message = "Invalid or missing Gemini API key. Please check your settings.";
            } else if (error?.message?.includes("Network error")) {
              message = "Network error: Please check your internet connection.";
            }
            callbacks.onError(new Error(message));
          },
          onclose: () => callbacks.onClose(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: `You are a friendly English tutor named Alex. Your goal is to help the user practice spoken English. 
          ${callbacks.rolePlay ? `We are doing a role-play: ${callbacks.rolePlay.title}. Scenario: ${callbacks.rolePlay.scenario}. I am the ${callbacks.rolePlay.tutorRole} and you are the ${callbacks.rolePlay.userRole}.` : "Be encouraging, correct their mistakes gently, and keep the conversation engaging."}
          Use simple language for beginners and more complex structures for advanced learners.`,
        },
      });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const int16Data = this.floatTo16BitPCM(inputData);
        const base64Data = this.uint8ArrayToBase64(new Uint8Array(int16Data.buffer));
        
        this.session.sendRealtimeInput({
          media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
        });
      };

      this.source.connect(this.processor);
      const silentGain = this.audioContext.createGain();
      silentGain.gain.value = 0;
      this.processor.connect(silentGain);
      silentGain.connect(this.audioContext.destination);

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

    } catch (error) {
      callbacks.onError(error);
    }
  }

  private floatTo16BitPCM(input: Float32Array) {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
  }

  private base64ToUint8Array(base64: string) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private uint8ArrayToBase64(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private async playAudio(data: Int16Array) {
    if (!this.audioContext) return;
    
    const floatData = new Float32Array(data.length);
    for (let i = 0; i < data.length; i++) {
      floatData[i] = data[i] / 0x8000;
    }

    const buffer = this.audioContext.createBuffer(1, floatData.length, 16000);
    buffer.getChannelData(0).set(floatData);

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    
    const now = this.audioContext.currentTime;
    if (this.nextStartTime < now) {
      this.nextStartTime = now + 0.05; // Small buffer
    }

    source.start(this.nextStartTime);
    this.activeSources.push(source);
    this.nextStartTime += buffer.duration;

    source.onended = () => {
      this.activeSources = this.activeSources.filter(s => s !== source);
    };
  }

  private stopAudio() {
    this.activeSources.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // Source might have already stopped
      }
    });
    this.activeSources = [];
    this.nextStartTime = 0;
    this.audioQueue = [];
    this.isPlaying = false;
  }

  disconnect() {
    this.stopAudio();
    this.session?.close();
    this.processor?.disconnect();
    this.source?.disconnect();
    this.audioContext?.close();
  }
}
