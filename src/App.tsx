import React, { PureComponent } from 'react';
import { ToastAndroid, LayoutAnimation } from 'react-native';
import Tts from 'react-native-tts';

import SpeechToTextService from 'services/SpeechToTextService';
import ChatScreen from 'screens/ChatScreen/ChatScreen';
import ContactsService from 'services/ContactsService';
import SnowboyService from 'services/SnowboyService';
import ChatMessage from 'models/ChatMessage';
import VirtualAssisstant from 'services/VirtualAssisstant';
import AssisstantResponse, { Choice } from 'models/AssisstantResponse';

enum AssisstantState {
    NO_PENDING_COMMAND,
    WAITING_FOR_FOLLOW_UP,
    WAITING_FOR_FOLLOW_UP_WITH_CHOICES,
}

interface State {
    chat: ChatMessage[];
    pendingMessage: string;
    isPredicting: boolean;
    isListening: boolean;
    currentAssisstantState: AssisstantState;
    choicesToDisplay?: Choice[];
}

export default class App extends PureComponent<{}, State> {
    state: State = {
        chat: [],
        pendingMessage: "",
        isPredicting: false,
        isListening: false,
        currentAssisstantState: AssisstantState.NO_PENDING_COMMAND,
        choicesToDisplay: []
    }

    async componentDidMount() {
        await SnowboyService.initialize();
        SpeechToTextService.initialize({
            onSpeechStartHandler: this.onSpeechStartHandler.bind(this),
            onSpeechEndHandler: this.onSpeechEndHandler.bind(this),
            onSpeechResultsHandler: this.onSpeechResultsHandler.bind(this),
            onSpeechPartialResultsHandler: this.onSpeechPartialResultsHandler.bind(this),
            onSpeechVolumeChangedHandler: this.onSpeechVolumeChangedHandler.bind(this),
            onSpeechErrorHandler: this.onSpeechErrorHandler.bind(this),
            onSpeechRecognizedHandler: this.onSpeechRecognizedHandler.bind(this),
        })

        SnowboyService.start();

        SnowboyService.removeAllListeners("msg-active");
        SnowboyService.addEventListener("msg-active", async (e: any) => {
            await SnowboyService.stop();
            SpeechToTextService.start();
        });

        ContactsService.initialize();
        Tts.getInitStatus().then(() => {
            Tts.speak('Hi, my name is Mohsen how can I help you.');
        });
    };

    componentWillUpdate() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    onSpeechStartHandler = (e: any) => this.setState({ isListening: true });
    onSpeechEndHandler = (e: any) => this.setState({ isListening: false });

    onSpeechResultsHandler = (e: any) => {
        this.setState({
            pendingMessage: e.value[0],
            isPredicting: true,
        }, async () => {
            this.forwardToAssistant(e.value[0]);
        });
    }
    onSpeechPartialResultsHandler = (e: any) => {
        this.setState({ pendingMessage: e.value });
    }
    onSpeechVolumeChangedHandler = (e: any) => { }
    onSpeechErrorHandler = (e: any) => {
        console.log(e);
        SnowboyService.start();
        this.setState({chat: [
            ...this.state.chat, {
                msg: "Something went wrong please try again later.",
                userMessage: false,
            }
        ], isListening: false})
    }
    onSpeechRecognizedHandler = (e: any) => { console.log("onSpeechRecognizedHandler", e) }

    forwardToAssistant = async (input: string | Choice) => {
        let assisstantResponse: AssisstantResponse;
        switch (this.state.currentAssisstantState) {
            case AssisstantState.NO_PENDING_COMMAND:
                assisstantResponse = await VirtualAssisstant.processUserInput(input as string);
                break;

            case AssisstantState.WAITING_FOR_FOLLOW_UP:
                assisstantResponse = await VirtualAssisstant.followUpOnCommand(input as string);
                break;

            case AssisstantState.WAITING_FOR_FOLLOW_UP_WITH_CHOICES:
                assisstantResponse = await VirtualAssisstant.followUpOnCommandByUserChoice(input as Choice);
                break;
        }

        if (assisstantResponse.commandUnderstood) {
            this.setState({
                pendingMessage: "",
                isPredicting: false,
                isListening: false,
                currentAssisstantState: AssisstantState.NO_PENDING_COMMAND,
                chat: [
                    ...this.state.chat,
                    {
                        msg: this.state.pendingMessage,
                        userMessage: true,
                    },
                    {
                        msg: assisstantResponse.userMessage,
                        userMessage: false,
                    },
                ],
                choicesToDisplay: undefined,
            });

            setTimeout(() => {
                assisstantResponse.execute && assisstantResponse.execute();
                SnowboyService.start();
            })
        } else {
            if (assisstantResponse.getVoiceInput) {
                this.setState({
                    currentAssisstantState: AssisstantState.WAITING_FOR_FOLLOW_UP,
                    choicesToDisplay: assisstantResponse.choices,
                    chat: [
                        ...this.state.chat,
                        {
                            msg: this.state.pendingMessage,
                            userMessage: true,
                        },
                        {
                            msg: assisstantResponse.userMessage,
                            userMessage: false,
                        },
                    ],
                });
                SpeechToTextService.start();
            } else if (assisstantResponse.displayChoices) {
                this.setState({
                    currentAssisstantState: AssisstantState.WAITING_FOR_FOLLOW_UP_WITH_CHOICES,
                    choicesToDisplay: assisstantResponse.choices,
                    chat: [
                        ...this.state.chat,
                        {
                            msg: this.state.pendingMessage,
                            userMessage: true,
                        },
                        {
                            msg: assisstantResponse.userMessage,
                            userMessage: false,
                            choicesToDisplay: assisstantResponse.choices
                        },
                    ],
                });
            }

            this.setState({ pendingMessage: "", isPredicting: false });
        }
    }

    render() {
        const {
            isPredicting,
            chat,
            pendingMessage,
            isListening,
            choicesToDisplay
        } = this.state;

        return (
            <ChatScreen
                chat={chat}
                isPredicting={isPredicting}
                pendingMessage={pendingMessage}
                isListening={isListening}
                choicesToDisplay={choicesToDisplay}
                onChoicePress={this.forwardToAssistant}
            />
        );
    }
};
