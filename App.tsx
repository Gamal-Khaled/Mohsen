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
} from 'react-native';

import snowboy from "react-native-snowboy";
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

  let stopService = function () {
    snowboy.stopRecording();
  };
  const sendToDB = () => {
    const fetchWrapper = new FetchWrapper('https://cs495-705cf.firebaseio.com');

    fetchWrapper.post("/sendToDBTest.json", { data: 'stort' });
  }

  return (
    <View>
      <Text>Hi</Text>
      <Button
        title="Press me"
        onPress={() => click()}
      />
      <Button
        title="Stop Service"
        onPress={() => stopService()}
      />
      <Button
        title="Send data to DB"
        onPress={sendToDB}
      />
    </View>
  );
};

export default App;
