# Mohsen The Virtual Assisstant

Mohsen is a voice virtual assisstant built from scratch.

### Understanding The User Command
We used Bidirectional long-short-term memory neural network thet we trained ourselves using [tensorflow](https://www.tensorflow.org/) for intent extraction and named entity recognition(NER) (2 separate models)
and hosted them using a simple server we made using [Flask](https://flask.palletsprojects.com/en/1.1.x/) and made a simple API for them to be able to use them on any platform using a client side app.

### The Mobile App
This is the client-side for android and IOS made using [React Native](https://reactnative.dev/) We used [snowboy](https://snowboy.kitt.ai/) to summon the assisstant, 
however, we didn't find a react native wrapper for it so we made it [ourselves](https://github.com/Hossam777/react-native-snowboy), then we get the user input using [React Native Voice](https://github.com/react-native-community/voice)
then we call the API we hosted to understand the user command and try to execute it
, If the app found that it need more data to execute the user command it follows up asking what data it needs.

### Helping The User Even More
The assisstant doesn't only listen to the user commands it also logs the user's commands (as a string not the actual voice clip) to be able to understand the user's routine 
and offer suggestions based on that, like if the user searches for restaurants everyday between 3:10 and 3:30 the assisstant will search for nearby restaurants at that time and 
display a heads-up notification for the user asking him if he wants to order food and offering him some choices.
We achieved that by implementing a [Firebase Function](https://firebase.google.com/docs/functions) that pulls the user history and make suggestions according to it.

## Features
We intend for the assisstant to be able to chat with the user, execute his voice command and make suggestions,
now the mobile app can make suggestions and execute only 3 commands: making phone calls, searching for a place and searching for a public figure.
