import Tts from 'react-native-tts';

class TTSService {
    private speakCallbacks: { [key: string]: () => void } = {};
    private getRecentSpeakCallbacks = () => this.speakCallbacks;

    constructor() {
        Tts.setDefaultVoice("en-us-x-sfg#female_2-local");

        Tts.addEventListener('tts-finish', (event) => {
            if (this.speakCallbacks[event.utteranceId]) {
                this.speakCallbacks[event.utteranceId]();
                delete this.speakCallbacks[event.utteranceId];
            }
        });
    }

    speak = (text: string, callback?: () => void) => {
        Tts.getInitStatus().then(() => {
            Tts.speak(text).then(utteranceId => {
                if (callback) {
                    this.speakCallbacks[`${utteranceId}`] = callback;
                }
            });
        });
    }
}

export default new TTSService();