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
  snowboy.addEventListener("msg-active", (e) => {
		console.log("hehehe")
	})
 let click = function(){
  snowboy.initHotword()
	.then((res)=> {
		console.log(res)
    snowboy.startRecording();
	})
	.catch((err)=> {
		console.log(err)
	})
  
 };
 let click2 = function(){
  snowboy.startService();
 };
 let click3 = function(){
  snowboy.stopService();
 };
  
  return (
    <View>
      <Text>Hi</Text>
      <Button
          title="start"
          onPress={() => click2()}
        />
        <Button
          title="stop"
          onPress={() => click3()}
        />
    </View>
  );
};

export default App;
