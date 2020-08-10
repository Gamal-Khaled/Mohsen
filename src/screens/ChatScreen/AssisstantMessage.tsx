import React, { useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Image,
    Linking
} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import { Choice } from 'models/AssisstantResponse';
import ChatMessage from "models/ChatMessage";
import Colors from 'assets/Colors';

const { width } = Dimensions.get('window');

interface Props {
    choicesToDisplay?: Choice[];
    onChoicePress: (selectedChoice: Choice) => void;
    message: ChatMessage;
}

export default ({
    choicesToDisplay,
    onChoicePress,
    message,
}: Props) => {
    const renderChoice = ({ item }: { item: Choice }) => (
        <TouchableOpacity
            style={styles.choiceContainer}
            onPress={() => onChoicePress(item)}
        >
            <Text>{item.value}</Text>
        </TouchableOpacity>
    )

    const onPress = () => {
        message.onClickUrl && Linking.openURL(message.onClickUrl);
    }

    return (
        <View style={styles.msgWrapper}>
            <View style={styles.msgContainer}>
                <TouchableOpacity
                    disabled={!message.onClickUrl}
                    onPress={onPress}
                >
                    {
                        message.thumbnail && (
                            <Image
                                source={{ uri: message.thumbnail }}
                                style={styles.thumbnail}
                            />
                        )
                    }
                    {
                        message.mapData && (
                            <MapboxGL.MapView
                                style={styles.thumbnail}
                                localizeLabels={true}
                                zoomEnabled={false}
                                scrollEnabled={false}
                                pitchEnabled={false}
                                rotateEnabled={false}
                            >
                                <MapboxGL.Camera
                                    zoomLevel={14}
                                    animationMode='flyTo'
                                    animationDuration={1000}
                                    centerCoordinate={message.mapData}
                                />
                            </MapboxGL.MapView>
                        )
                    }
                    <Text style={styles.msg}>{message.msg}</Text>
                    {
                        message.onClickUrl && (
                            <Text style={styles.seeMore}>Read More...</Text>
                        )
                    }
                </TouchableOpacity>
                {
                    choicesToDisplay && (
                        <FlatList
                            data={choicesToDisplay}
                            renderItem={renderChoice}
                            style={styles.choicesWrapper}
                            keyExtractor={choice => choice.id.toString()}
                        />
                    )
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    msgWrapper: {
        padding: 10,
        width: '100%',
        paddingBottom: 0,
        paddingRight: 100,
        alignItems: "flex-start",
    },
    msgContainer: {
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: Colors.systemMessageBackground,
    },
    msg: {
        color: Colors.systemMessage,
    },
    choiceContainer: {
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 5,
        borderColor: Colors.primary,
        paddingHorizontal: 10,
        width: width / 2,
        marginTop: 7,
    },
    choicesWrapper: {
        marginVertical: 5,
    },
    thumbnail: {
        width: width - 120,
        height: width - 120,
        borderRadius: 5,
        marginVertical: 5,
    },
    seeMore: {
        color: Colors.linkTextColor,
    }
});