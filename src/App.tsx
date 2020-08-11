import React, { PureComponent } from 'react';
import messaging from "@react-native-firebase/messaging";

import MainSwitchNavigation from 'navigation/MainSwitchNavigation';

export default class App extends PureComponent {
    render() {
        messaging().getToken().then(console.log);

        return <MainSwitchNavigation />;
    }
};
