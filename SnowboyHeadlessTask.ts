import { AppState, Linking, ToastAndroid, NativeModules } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

import SpeechToTextService from "services/SpeechToTextService";
import TTSService from "services/TTSService";
import AssisstantResponse, { Choice } from "models/AssisstantResponse";
import { AssisstantState } from './src/App';
import VirtualAssisstant from "services/VirtualAssisstant";

const currentAssisstantStateKey = "@BACKGROUND:CURRENT_ASSISSTANT_STATE";
const snowboyService = NativeModules.SnowboyServiceModule;

export default async (taskData: any) => {
    if (AppState.currentState !== "active") {
        const forwardToAssistant = async (input: string | Choice) => {
            let assisstantResponse: AssisstantResponse;
            const currentAssisstantState = parseInt(
                await AsyncStorage.getItem(currentAssisstantStateKey) ||
                AssisstantState.NO_PENDING_COMMAND.toString()
            );

            switch (currentAssisstantState) {
                case AssisstantState.NO_PENDING_COMMAND:
                    assisstantResponse = await VirtualAssisstant.processUserInput(input as string);
                    break;

                case AssisstantState.WAITING_FOR_FOLLOW_UP:
                    assisstantResponse = await VirtualAssisstant.followUpOnCommand(input as string);
                    break;

                case AssisstantState.WAITING_FOR_FOLLOW_UP_WITH_CHOICES:
                    assisstantResponse = await VirtualAssisstant.followUpOnCommandByUserChoice(input as Choice);
                    break;

                // AssisstantState.NO_PENDING_COMMAND
                default:
                    assisstantResponse = await VirtualAssisstant.processUserInput(input as string);
                    break;
            }

            if (assisstantResponse.commandUnderstood) {
                await AsyncStorage.setItem(currentAssisstantStateKey, AssisstantState.NO_PENDING_COMMAND.toString());

                TTSService.speak(
                    assisstantResponse.userMessage.split(".")[0],
                    async () => {
                        if (assisstantResponse.execute) {
                            const commandResponse = await assisstantResponse.execute();
                            if (!commandResponse.done && commandResponse.message) {
                                TTSService.speak(commandResponse.message);
                            }
                        } else {
                            if (assisstantResponse.onClickUrl) {
                                Linking.openURL(assisstantResponse.onClickUrl);
                            }
                        }
                    });
            } else {
                if (assisstantResponse.getVoiceInput) {
                    TTSService.speak(assisstantResponse.userMessage);
                    await AsyncStorage.setItem(currentAssisstantStateKey, AssisstantState.WAITING_FOR_FOLLOW_UP.toString());
                    SpeechToTextService.start();
                    if (assisstantResponse.onClickUrl) {
                        Linking.openURL(assisstantResponse.onClickUrl);
                    }
                } else if (assisstantResponse.displayChoices) {
                    await AsyncStorage.setItem(currentAssisstantStateKey, AssisstantState.NO_PENDING_COMMAND.toString());

                    TTSService.speak("Sorry I got many results, please open the app and ask again");
                }
            }

            await snowboyService.startService();
        }

        const onSpeechPartialResultsHandler = (e: any) => console.log(e.value);
        const onSpeechVolumeChangedHandler = (e: any) => null;
        const onSpeechRecognizedHandler = (e: any) => null;
        const onSpeechStartHandler = (e: any) => null;
        const onSpeechEndHandler = (e: any) => null;

        const onSpeechResultsHandler = (e: any) => {
            console.log(e.value[0]);
            forwardToAssistant(e.value[0]);
            ToastAndroid.show(e.value[0], ToastAndroid.LONG);
        }

        const onSpeechErrorHandler = (e: any) => {
            // SnowboyService.start();
            TTSService.speak('Something went wrong please try again later.');
        }

        SpeechToTextService.initialize({
            onSpeechStartHandler,
            onSpeechEndHandler,
            onSpeechResultsHandler,
            onSpeechPartialResultsHandler,
            onSpeechVolumeChangedHandler,
            onSpeechErrorHandler,
            onSpeechRecognizedHandler,
        });


        await snowboyService.stopService();
        SpeechToTextService.start();
    }
};