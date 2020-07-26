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
  Alert,
} from 'react-native';

import snowboy from "react-native-snowboy";

const App = () => {
  //Call the function here
 let click = function(){
  snowboy.initHotword()
	.then((res)=> {
		console.log(res)
    snowboy.startRecording();
	})
	.catch((err)=> {
		console.log(err)
	})
  snowboy.addEventListener("msg-active", (e) => {
		console.log("hehehe")
	})
 };
 let stop = function(){
  snowboy.stopRecording();
	console.log("stopped");
 };

  return (
    <View>
      <Text>Hi</Text>
      <Button
          title="Press me"
          onPress={() => click()}
        />
        <Button
        title="stop"
        onPress={() => stop()}
      />
    </View>
  );
};

export default App;
