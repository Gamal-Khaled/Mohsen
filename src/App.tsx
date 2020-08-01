import React, { PureComponent } from 'react';
import { ToastAndroid, LayoutAnimation } from 'react-native';
import Tts from 'react-native-tts';

import SnowboyService from 'services/SnowboyService';
import SpeechToTextService from 'services/SpeechToTextService';
import ChatScreen from 'screens/ChatScreen/ChatScreen';
import MLModeslsAPIHandler from 'apis/MLModeslsAPIHandler';
import ChatMessage from 'models/ChatMessage';

interface State {
    chat: ChatMessage[];
    pendingMessage: string;
    isPredicting: boolean;
    isListening: boolean;
}

export default class App extends PureComponent<{}, State> {
    state = {
        chat: [],
        pendingMessage: "",
        isPredicting: false,
        isListening: false,
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
        // SnowboyService.start();

        this.setState({
            pendingMessage: e.value[0],
            isPredicting: true,
        }, async () => {
            const results = await Promise.all([
                this.predictIntent(e.value[0]),
                this.predictEntities(e.value[0]),
            ]);

            let error = false;
            results.forEach(res => error = error || !!res.error);

            console.log(results);
            if (error) {
                this.setState({
                    isPredicting: false,
                    pendingMessage: "",
                });
                ToastAndroid.show("Something went wrong please try again.", ToastAndroid.LONG);
            } else {
                this.setState({
                    isPredicting: false,
                    pendingMessage: "",
                    chat: [
                        ...this.state.chat,
                        {
                            msg: e.value[0],
                            userMessage: true,
                        }
                    ]
                });
            }
            SnowboyService.start();
        });
    }
    onSpeechPartialResultsHandler = (e: any) => {
        console.log(e)
        this.setState({ pendingMessage: e.value });
    }
    onSpeechVolumeChangedHandler = (e: any) => { }
    onSpeechErrorHandler = (e: any) => {
        console.log(e);
        SnowboyService.start();
        ToastAndroid.show("Something went wrong please try again later.", ToastAndroid.LONG);
    }
    onSpeechRecognizedHandler = (e: any) => { console.log("onSpeechRecognizedHandler", e) }

    predictIntent = async (text: string) => {
        try {
            const response = await MLModeslsAPIHandler.predictIntent(text);
            return response.result;
        } catch (e) {
            return { error: true, errorMessage: e };
        }
    }

    predictEntities = async (text: string) => {
        try {
            const response = await MLModeslsAPIHandler.predictEntities(text);
            return response.result;
        } catch (e) {
            return { error: true, errorMessage: e };
        }
    }

    render() {
        const { isPredicting, chat, pendingMessage, isListening } = this.state;

        return (
            <ChatScreen
                chat={chat}
                isPredicting={isPredicting}
                pendingMessage={pendingMessage}
                isListening={isListening}
            />
        );
    }
};
