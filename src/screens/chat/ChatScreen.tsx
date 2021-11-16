import React, { PureComponent } from 'react';
import { LayoutAnimation, NativeModules, AppState, AppStateStatus, ScrollView, View, StyleSheet, Text, CheckBox } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';

import SpeechToTextService from 'services/SpeechToTextService';
import SnowboyService from 'services/SnowboyService';
import VirtualAssisstant from 'services/VirtualAssisstant';
import TTSService from 'services/TTSService';
import ChatMessage from 'models/ChatMessage';
import AssisstantResponse, { Choice } from 'models/AssisstantResponse';
import Chat from './Chat';
import SuggetionsSchedular from 'services/SuggetionsSchedular';
import Colors from 'assets/Colors';
import Switch from 'common/components/switch';

export enum AssisstantState {
    NO_PENDING_COMMAND,
    WAITING_FOR_FOLLOW_UP,
    WAITING_FOR_FOLLOW_UP_WITH_CHOICES,
}

export enum CommandType {
    VOICE,
    TYPED,
}

interface State {
    chat: ChatMessage[];
    pendingMessage: string;
    isPredicting: boolean;
    isListening: boolean;
    currentAssisstantState: AssisstantState;
    choicesToDisplay?: Choice[];
    speak: boolean;
    enableVoiceCommands: boolean;
    commandType?: CommandType;
}

const snowboyService = NativeModules.SnowboyServiceModule;

export default class ChatScreen extends PureComponent<NavigationInjectedProps, State> {
    state: State = {
        chat: [],
        pendingMessage: "",
        isPredicting: false,
        isListening: false,
        currentAssisstantState: AssisstantState.NO_PENDING_COMMAND,
        choicesToDisplay: [],
        speak: true,
        enableVoiceCommands: false,
    }
    scrollRef: ScrollView | null = null;

    async componentDidMount() {
        snowboyService.stopService();
        AppState.addEventListener('change', this.onAppStateChange);

        // await SnowboyService.initialize();
        SpeechToTextService.initialize({
            onSpeechStartHandler: this.onSpeechStartHandler.bind(this),
            onSpeechEndHandler: this.onSpeechEndHandler.bind(this),
            onSpeechResultsHandler: this.onSpeechResultsHandler.bind(this),
            onSpeechPartialResultsHandler: this.onSpeechPartialResultsHandler.bind(this),
            onSpeechVolumeChangedHandler: this.onSpeechVolumeChangedHandler.bind(this),
            onSpeechErrorHandler: this.onSpeechErrorHandler.bind(this),
            onSpeechRecognizedHandler: this.onSpeechRecognizedHandler.bind(this),
        })

        SnowboyService.removeAllListeners("msg-active");
        SnowboyService.addEventListener("msg-active", _ => {
            this.startListening(true);
        });

        this.startSnowBoy();

        SuggetionsSchedular.start();

        this.onTextInputSubmit("where is elgiza");
    };

    async componentWillUnmount() {
        AppState.removeEventListener('change', this.onAppStateChange);
    }

    componentWillUpdate() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setTimeout(() => {
            this.scrollRef?.scrollToEnd({ animated: true });
        }, 20);
    }

    onAppStateChange = async (state: AppStateStatus) => {
        if (state !== "active" && !await snowboyService.isSnowboyServiceRunning()) {
            await snowboyService.startService();
        } else if (state === "active") {
            await snowboyService.stopService();
        }
    }

    startListening = async (speak: boolean) => {
        this.setState({ speak });
        await SnowboyService.stop();
        SpeechToTextService.start();
    }

    startSnowBoy = () => {
        if (this.state.enableVoiceCommands) {
            SnowboyService.start();
        }
    }

    onSpeechVolumeChangedHandler = (e: any) => null;
    onSpeechRecognizedHandler = (e: any) => null;
    onSpeechStartHandler = (e: any) => this.setState({ isListening: true });
    onSpeechEndHandler = (e: any) => this.setState({ isListening: false });

    onSpeechResultsHandler = (e: any) => {
        this.setState({
            pendingMessage: e.value[0],
            isPredicting: true,
            commandType: CommandType.VOICE,
        }, async () => {
            this.forwardToAssistant(e.value[0]);
        });
    }

    onSpeechPartialResultsHandler = (e: any) => {
        this.setState({ pendingMessage: e.value });
    }

    onSpeechErrorHandler = (e: any) => {
        console.log("onSpeechErrorHandler", e);
        this.startSnowBoy();
        if (e.message !== "7/No match") {
            this.setState({
                chat: [
                    ...this.state.chat, {
                        msg: "Something went wrong please try again later.",
                        userMessage: false,
                    }
                ], isListening: false
            })
        }

        if (this.state.speak)
            TTSService.speak('Something went wrong please try again later.');
    }

    onTextInputSubmit = async (text: string) => {
        await SnowboyService.stop();
        this.setState({
            pendingMessage: text,
            isPredicting: true,
            speak: false,
            commandType: CommandType.TYPED,
        }, async () => {
            this.forwardToAssistant(text);
        });
    }

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
                        onClickUrl: assisstantResponse.onClickUrl,
                        thumbnail: assisstantResponse.thumbnail,
                        mapData: assisstantResponse.mapsAPIData,
                    },
                ],
                choicesToDisplay: undefined,
            });

            const execute = async () => {
                if (assisstantResponse.execute) {
                    const commandResponse = await assisstantResponse.execute();
                    if (!commandResponse.done && commandResponse.message) {
                        this.setState({
                            chat: [
                                ...this.state.chat, {
                                    msg: commandResponse.message,
                                    userMessage: false,
                                    onClickUrl: assisstantResponse.onClickUrl,
                                    thumbnail: assisstantResponse.thumbnail,
                                }
                            ]
                        });
                        if (this.state.speak)
                            TTSService.speak(commandResponse.message);
                    }
                }
                this.startSnowBoy();
            }

            if (this.state.speak) {
                TTSService.speak(assisstantResponse.userMessage.split(".")[0], execute);
            } else {
                execute();
            }
        } else {
            if (assisstantResponse.getVoiceInput && this.state.commandType === CommandType.VOICE) {
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
                            onClickUrl: assisstantResponse.onClickUrl,
                            thumbnail: assisstantResponse.thumbnail,
                        },
                    ],
                });

                if (this.state.speak) {
                    TTSService.speak(assisstantResponse.userMessage, SpeechToTextService.start);
                } else {
                    SpeechToTextService.start();
                }
            } else if (assisstantResponse.displayChoices) {
                TTSService.speak(assisstantResponse.userMessage);
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
                            onClickUrl: assisstantResponse.onClickUrl,
                            thumbnail: assisstantResponse.thumbnail,
                        },
                    ],
                });
            }

            this.setState({ pendingMessage: "", isPredicting: false });
        }
    }

    toggleVoiceCommands = async () => {
        const { enableVoiceCommands } = this.state;

        if (enableVoiceCommands) {
            await SnowboyService.stop();
        } else {
            SnowboyService.start();
        }
        this.setState({ enableVoiceCommands: !enableVoiceCommands });
    }

    render() {
        const {
            isPredicting,
            chat,
            pendingMessage,
            isListening,
            choicesToDisplay,
            enableVoiceCommands
        } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Enable Voice Commands</Text>
                    <Switch
                        value={enableVoiceCommands}
                        onChangeValue={this.toggleVoiceCommands}
                    />
                </View>
                <Chat
                    chat={chat}
                    isPredicting={isPredicting}
                    pendingMessage={pendingMessage}
                    isListening={isListening}
                    choicesToDisplay={choicesToDisplay}
                    onChoicePress={this.forwardToAssistant}
                    onMicIconPress={() => this.startListening(true)}
                    onTextInputSubmit={this.onTextInputSubmit}
                    scrollRef={ref => this.scrollRef = ref}
                    navigation={this.props.navigation}
                />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    header: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center'
    },
    headerText: {
        color: Colors.primaryText,
        fontWeight: 'bold',
        fontSize: 18
    }
})