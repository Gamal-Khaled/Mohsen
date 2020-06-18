import React, { PureComponent } from 'react';
import {
    View,
    Text,
    Button,
    Alert,
    PermissionsAndroid,
} from 'react-native';
import snowboy from "react-native-snowboy";

import SnowboyService from './services/SnowboyService';

export default class App extends PureComponent {
    async componentDidMount() {
        await SnowboyService.initialize();
        SnowboyService.start();

        SnowboyService.addEventListener("msg-active", (e: any) => {
            console.log("hehehe")
        })
    };

    render() {
        return (
            <View>
                <Text>Hi</Text>
                <Text>I'm Mohsen</Text>
            </View>
        );
    }
};
