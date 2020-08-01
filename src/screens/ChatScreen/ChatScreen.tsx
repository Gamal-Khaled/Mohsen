import React from 'react';
import { Text, View, FlatList, StyleSheet, ActivityIndicator, Image, StatusBar } from 'react-native';

import ChatMessage from 'models/ChatMessage';
import Colors from 'assets/Colors';
import { Choice } from 'models/AssisstantResponse';
import UserMessage from './UserMessage';
import AssisstantMessage from './AssisstantMessage';

interface Props {
    chat: ChatMessage[];
    pendingMessage: string;
    isPredicting: boolean;
    isListening: boolean;
    choicesToDisplay?: Choice[];
    onChoicePress: (selectedChoice: Choice) => void;
}

export default ({
    chat,
    pendingMessage,
    isPredicting,
    isListening,
    choicesToDisplay,
    onChoicePress,
}: Props) => {
    const renderMessage = ({ item }: { item: ChatMessage }) => item.msg.length > 0 && (
        item.userMessage ? (
            <UserMessage message={item}/>
        ) : (
            <AssisstantMessage
                message={item}
                choicesToDisplay={choicesToDisplay}
                onChoicePress={onChoicePress}
            />
        )
    )

    const isEmpty = () => chat.length + pendingMessage.length === 0;

    if (isEmpty()) {
        return (
            <View style={[styles.container, styles.emptyContainer]}>
                <Text style={styles.emptyText}>Hi, my name is Mohsen how can I help you.</Text>
                {
                    isListening && <Image source={require("images/listening.gif")} style={styles.listening} />
                }
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.primary} />
            <View>
                <View>
                    <FlatList
                        data={chat}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={renderMessage}
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
            {
                isListening && <Image source={require("images/listening.gif")} style={styles.listening} />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        justifyContent: 'space-between',
        backgroundColor: Colors.primary,
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
    },
    emptyContainer: {
        justifyContent: 'space-around',
        alignItems: 'center',
    },
})