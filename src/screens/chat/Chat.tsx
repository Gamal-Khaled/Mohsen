import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Image,
    ScrollView,
    Dimensions,
    TextInput,
    TouchableOpacity
} from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NavigationInjectedProps } from 'react-navigation';

import ChatMessage from 'models/ChatMessage';
import Colors from 'assets/Colors';
import { Choice } from 'models/AssisstantResponse';
import UserMessage from './UserMessage';
import AssisstantMessage from './AssisstantMessage';

const { height } = Dimensions.get('window');

interface Props extends NavigationInjectedProps{
    chat: ChatMessage[];
    pendingMessage: string;
    isPredicting: boolean;
    isListening: boolean;
    choicesToDisplay?: Choice[];
    onChoicePress: (selectedChoice: Choice) => void;
    onMicIconPress: () => void;
    onTextInputSubmit: (text: string) => void;
    scrollRef?: ((instance: ScrollView | null) => void);
}

export default ({
    chat,
    pendingMessage,
    isPredicting,
    isListening,
    choicesToDisplay,
    onChoicePress,
    onMicIconPress,
    onTextInputSubmit,
    scrollRef,
    navigation
}: Props) => {
    const [inputText, setInputText] = useState("");
    
    const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
        if (!user) {
            navigation.navigate("AuthSwitchNavigation");
        }
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);


    const renderMessage = ({ item, index }: { item: ChatMessage, index: number }) => item.msg.length > 0 ? (
        item.userMessage ? (
            <UserMessage message={item} />
        ) : (
                <AssisstantMessage
                    message={item}
                    choicesToDisplay={chat.length - 1 == index ? choicesToDisplay : undefined}
                    onChoicePress={onChoicePress}
                />
            )
    ) : <View />;

    const onSumitKeyboardInput = () => {
        onTextInputSubmit(inputText);
        setInputText("");
    }

    const keyboardInput = () => (
        <View style={styles.keyboardInputContainer}>
            <TextInput
                value={inputText}
                onChangeText={setInputText}
                style={styles.keyboardInput}
                placeholder='Say "Hey Mohsen"'
                placeholderTextColor={Colors.primaryText}
                onSubmitEditing={onSumitKeyboardInput}
            />
            <TouchableOpacity onPress={onMicIconPress}>
                <Image
                    source={require("assets/images/microphone-solid.png")}
                    style={styles.micIcon}
                />
            </TouchableOpacity>
        </View>
    )

    const isEmpty = () => chat.length + pendingMessage.length === 0;

    if (isEmpty()) {
        return (
            <View style={[styles.container, styles.emptyContainer]}>
                <View />
                <Text style={styles.emptyText}>Hi, my name is Mohsen how can I help you.</Text>
                {
                    isListening && <Image source={require("images/listening.gif")} style={styles.listening} />
                }
                {keyboardInput()}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView ref={scrollRef}>
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={chat}
                                keyExtractor={(_, i) => i.toString()}
                                renderItem={renderMessage}
                                contentContainerStyle={{ flex: 1 }}
                            />
                        </View>
                        {
                            pendingMessage.length > 0 && (
                                <View style={[styles.msgWrapper, styles.userMSGWrapper]}>
                                    <View style={[styles.msgContainer, styles.userMSGContainer]}>
                                        <Text style={[styles.msg, styles.userMSG]}>{pendingMessage}</Text>
                                        {
                                            isPredicting && <ActivityIndicator color={Colors.userMessage} style={styles.inPending} />
                                        }
                                    </View>
                                </View>
                            )
                        }
                    </View>
                </View>
            </ScrollView>
            {
                isListening && <Image source={require("images/listening.gif")} style={styles.listening} />
            }
            {keyboardInput()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        justifyContent: 'space-between',
        backgroundColor: Colors.primary,
        height
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.accent,
    },
    text: {
        color: '#fff',
    },
    msgWrapper: {
        padding: 10,
        width: '100%',
        paddingBottom: 0,
        paddingRight: 100,
        alignItems: "flex-start",
    },
    userMSGWrapper: {
        paddingRight: 10,
        paddingLeft: 100,
        alignItems: "flex-end",
    },
    msgContainer: {
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: Colors.systemMessageBackground,
    },
    userMSGContainer: {
        backgroundColor: Colors.userMessageBackground,
        flexDirection: 'row',
    },
    msg: {
        color: Colors.systemMessage,
    },
    userMSG: {
        color: Colors.userMessage,
    },
    inPending: {
        marginLeft: 10,
    },
    listening: {
        height: 100,
        width: 100,
        alignSelf: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.primaryText,
        fontSize: 15,
    },
    emptyContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    keyboardInputContainer: {
        backgroundColor: Colors.accent,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: 'center',
        borderRadius: 30,
        height: 50,
        margin: 15,
    },
    placeHolder: {
        height: 80,
    },
    keyboardInput: {
        flex: 1,
        padding: 0,
        height: 40,
        fontSize: 16,
        color: Colors.primaryText,
        borderColor: Colors.primary,
    },
    micIcon: {
        tintColor: Colors.primaryText,
        height: 27,
        width: 35,
        resizeMode: 'contain'
    }
})