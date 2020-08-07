declare module 'react-native-tts' {
    export interface Event {
        utteranceId: string
    }

    export function setDefaultVoice(voiceId: string): void;
    export function addEventListener(
        eventName: string,
        handler: (event: Event) => void
    ): void;
    export function getInitStatus(): Promise<void>;
    export function speak(text: string): Promise<number>;
}