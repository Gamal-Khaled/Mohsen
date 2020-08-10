/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  View,
  Text,
  Button,
  NativeModules,
} from 'react-native';

const snowboyService = NativeModules.SnowboyServiceModule; 
import snowboy from "react-native-snowboy";
import ReactNativeAlarm from 'react-native-react-native-alarm';
import FetchWrapper from './src/service/FetchWrapper';

const App = () => {
  //Call the function here
  let click = function () {
    snowboy.initHotword()
      .then((res) => {
        console.log(res)
        snowboy.startRecording();
      })
      .catch((err) => {
        console.log(err)
      })
    snowboy.addEventListener("msg-active", (e) => {
      console.log("hehehe")
    })
  };

  let startService = function () {
    snowboyService.startService();
  };
  let stopService = function () {
    snowboyService.stopService();
  };
  let checkServiceStatus = function () {
    snowboyService.isSnowboyServiceRunning()
    .then(() => {
      console.log("Snowboy Service Running");
    })
    .catch(() => {
      console.log("Snowboy Service Not Running");
    })
  };
  const addAlarm = () => {
    ReactNativeAlarm.addAlarm("after 1 hour")
    .then(() => {
      console.log("Alarm Seted");
    })
    .catch(() => {
      console.log("Alarm Failed Seted");
    })
  }
  const sendToDB = () => {
    const fetchWrapper = new FetchWrapper('https://cs495-705cf.firebaseio.com');
  
    fetchWrapper.post("/SnowboyHeadlessTaskTest.json", { data: 'stort' });
  }

  return (
    <View>
      <Text>Hi</Text>
      <Button
        title="Press me"
        onPress={() => click()}
      />
      <Button
        title="Start Service"
        onPress={() => startService()}
      />
      <Button
        title="Stop Service"
        onPress={() => stopService()}
      />
      <Button
        title="Check Service Status"
        onPress={checkServiceStatus}
      />
      <Button
        title="Add Alarm"
        onPress={addAlarm}
      />
    </View>
  );
};

export default App;
