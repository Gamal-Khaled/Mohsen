import React, { Component } from 'react';
import { StyleSheet, Button, View, Text, FlatList } from 'react-native';
import { SpeechResultsEvent } from '@react-native-community/voice';

import SpeechToTextService from './src/services/SpeechToTextService';

interface Props { }
interface State {
    recordingState: string,
    text: string[],
    workingText: string[],
}

class App extends Component<Props, State> {
    state = {
        recordingState: "not recording",
        text: [],
        workingText: [],
    }

    constructor(props: Props) {
        super(props);

        SpeechToTextService.initialize({
            onSpeechStartHandler: this.onSpeechStartHandler.bind(this),
            onSpeechEndHandler: this.onSpeechEndHandler.bind(this),
            onSpeechResultsHandler: this.onSpeechResultsHandler.bind(this),
            onSpeechPartialResultsHandler: this.onSpeechPartialResultsHandler.bind(this),
            onSpeechVolumeChangedHandler: this.onSpeechVolumeChangedHandler.bind(this),
        })
    }

    onSpeechVolumeChangedHandler = () => null

    onSpeechStartHandler = (p: any) => {
        this.setState({ recordingState: "recording" });
    }

    onSpeechEndHandler = (p: any) => {
        this.setState({ recordingState: "finished recording" });
    }

    onSpeechResultsHandler = (text: SpeechResultsEvent) => {
        this.setState({ recordingState: "result done", text: text.value || [] });
        console.log(text)
    }

    onSpeechPartialResultsHandler = (event: SpeechResultsEvent) => {
        this.setState({ workingText: event.value || [] });
    }

    onStartButtonPress() {
        SpeechToTextService.start('en-US');
    }

    render() {
        return (
            <View>
                <View style={styles.recordingStateContainer}>
                    <View style={[styles.recordingState, { backgroundColor: this.state.recordingState === "recording" ? "green" : "red" }]} />
                    <Text>{this.state.recordingState}</Text>
                </View>
                <Button
                    title="Record"
                    onPress={this.onStartButtonPress}
                />
                <View style={styles.Divider} />
                <Button
                    title="Stop Recording (Shut up to stop automatically)"
                    onPress={SpeechToTextService.stop}
                />
                <View style={styles.Divider} />
                <Text style={styles.working}>{this.state.workingText[this.state.workingText.length - 1]}</Text>
                <View style={styles.Divider} />
                <FlatList
                    data={this.state.text}
                    renderItem={({ item }) => <Text>{item}</Text>}
                    keyExtractor={item => item}
                />
            </View>
        )
    }
};

const styles = StyleSheet.create({
    Divider: {
        height: 1,
        backgroundColor: "#000",
    },
    working: {
        color: "green"
    },
    recordingStateContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    recordingState: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
});

export default App;
