import { PermissionsAndroid } from 'react-native';
import Voice, {
    SpeechResultsEvent,
    SpeechStartEvent,
    SpeechEndEvent,
    SpeechVolumeChangeEvent,
    SpeechErrorEvent,
    SpeechRecognizedEvent
} from '@react-native-community/voice';

export interface SpeechToTextEventsHandlers {
    onSpeechStartHandler: (event: SpeechStartEvent) => void;
    onSpeechEndHandler: (event: SpeechEndEvent) => void;
    onSpeechResultsHandler: (event: SpeechResultsEvent) => void;
    onSpeechPartialResultsHandler: (event: SpeechResultsEvent) => void;
    onSpeechVolumeChangedHandler: (event: SpeechVolumeChangeEvent) => void;
    onSpeechErrorHandler: (event: SpeechErrorEvent) => void;
    onSpeechRecognizedHandler: (event: SpeechRecognizedEvent) => void;
}

class SpeechToText {
    initialize = (eventsHandlers: SpeechToTextEventsHandlers) => {
        Voice.onSpeechStart = eventsHandlers.onSpeechStartHandler;
        Voice.onSpeechEnd = eventsHandlers.onSpeechEndHandler;
        Voice.onSpeechResults = eventsHandlers.onSpeechResultsHandler;
        Voice.onSpeechPartialResults = eventsHandlers.onSpeechPartialResultsHandler;
        Voice.onSpeechVolumeChanged = eventsHandlers.onSpeechVolumeChangedHandler;
        Voice.onSpeechError = eventsHandlers.onSpeechErrorHandler;
        Voice.onSpeechRecognized = eventsHandlers.onSpeechRecognizedHandler;
    }

    on = (event: string, handler: (event: any) => void) => Voice[event] = handler;

    isAvailable = () => Voice.isAvailable();
    start = (locale: string = "en-US") => Voice.start(locale);
    stop = () => Voice.stop();
    cancel = () => Voice.cancel();
    destroy = () => Voice.destroy();
    removeAllListeners = () => Voice.removeAllListeners();
    isRecognizing = () => Voice.isRecognizing();
    getSpeechRecognitionServices = () => Voice.getSpeechRecognitionServices();


    checkPermissions = async () => {
        let granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.AUDIO_RECORDING);

        return granted;
    }

    requestPermissions = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const userResponse = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.AUDIO_RECORDING);

                resolve(userResponse === "granted");
            } catch (err) {
                reject(err);
            }
        });
    }
}

export default new SpeechToText();