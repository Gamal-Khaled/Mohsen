import React, { PureComponent } from "react";
import { View, Modal, ActivityIndicator, StyleSheet, StyleProp, ViewStyle } from "react-native";

interface Props {
    loading: boolean;
    contentContainerStyle?: StyleProp<ViewStyle>;
}

export default class LoadingSpinnerHandler extends PureComponent<Props> {
    render() {
        const { children, loading, contentContainerStyle } = this.props;

        return (
            <View style={[styles.container, contentContainerStyle]}>
                {children}
                <Modal
                    animated
                    animationType="fade"
                    visible={loading}
                    transparent
                >
                    <View style={styles.spinnerContainer}>
                        <ActivityIndicator
                            size="large"
                            color="#FFF"
                        />
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    spinnerContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
})