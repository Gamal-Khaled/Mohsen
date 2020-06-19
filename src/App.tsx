import React, { PureComponent } from 'react';
import {
    View,
    Text,
} from 'react-native';

import SnowboyService from './services/SnowboyService';
import SpeechToTextService from './services/SpeechToTextService';

export default class App extends PureComponent {
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

        SnowboyService.addEventListener("msg-active", async (e: any) => {
            SnowboyService.stop();
            setTimeout(() => {
                SpeechToTextService.start();
            }, 50);
        })
    };

    onSpeechStartHandler = (e: any) => { console.log("onSpeechStartHandler", e) }
    onSpeechEndHandler = (e: any) => { console.log("onSpeechEndHandler", e) }
    onSpeechResultsHandler = (e: any) => { console.log("onSpeechResultsHandler", e), SnowboyService.start(); }
    onSpeechPartialResultsHandler = (e: any) => { /* console.log("onSpeechPartialResultsHandler", e) */ }
    onSpeechVolumeChangedHandler = (e: any) => { }
    onSpeechErrorHandler = (e: any) => { console.log("onSpeechErrorHandler", e) }
    onSpeechRecognizedHandler = (e: any) => { console.log("onSpeechRecognizedHandler", e) }

    render() {
        return (
            <View>
                <Text>Hi</Text>
                <Text>I'm Mohsen</Text>
            </View>
        );
    }
};
