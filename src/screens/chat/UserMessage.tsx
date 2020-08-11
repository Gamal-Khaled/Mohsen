import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import ChatMessage from "models/ChatMessage";
import Colors from 'assets/Colors';

export default ({ message }: { message: ChatMessage }) => (
    <View style={styles.msgWrapper}>
        <View style={styles.msgContainer}>
            <Text style={styles.msg}>{message.msg}</Text>
        </View>
    </View>
)

const styles = StyleSheet.create({
    msgWrapper: {
        padding: 10,
        width: '100%',
        paddingBottom: 0,
        paddingRight: 10,
        paddingLeft: 100,
        alignItems: "flex-end",
    },
    msgContainer: {
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: Colors.userMessageBackground,
        flexDirection: 'row',
    },
    msg: {
        color: Colors.userMessage,
    }
});