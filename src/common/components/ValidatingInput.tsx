import React, { PureComponent, ReactElement } from 'react';
import {
    View,
    StyleProp,
    StyleSheet,
    NativeSyntheticEvent,
    TextInputFocusEventData,
    LayoutAnimation,
    TextInputProps,
    TextInput,
    TextStyle,
    ViewStyle,
    TouchableOpacity,
    Text
} from 'react-native';

interface Props extends TextInputProps {
    getErrorMessage: (value: string) => string;
    errorMsgStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    inputContainerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    value: string;
    icon?: (props: any) => ReactElement;
    onIconPress?: () => void;
}

interface State {
    didBlur: boolean;
    errorMsg: string;
    value: string;
}

export default class ValidatingInput extends PureComponent<Props, State> {
    state = {
        didBlur: false,
        errorMsg: "",
        value: this.props.value || "",
    }

    onChangeText = (value: string) => {
        const { getErrorMessage, onChangeText } = this.props;

        if (this.state.didBlur) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            this.setState({
                errorMsg: getErrorMessage(value),
                value
            });
        } else {
            this.setState({ value });
        }

        onChangeText && onChangeText(value);
    }

    onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        const { didBlur, value } = this.state;
        const { getErrorMessage, onBlur } = this.props;

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (!didBlur) {
            this.setState({ didBlur: true });
            this.setState({ errorMsg: getErrorMessage(value) })
        }

        onBlur && onBlur(e);
    }

    forceValidate = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const { getErrorMessage, value } = this.props;
        this.setState({
            errorMsg: getErrorMessage(value),
            didBlur: true
        });
    }

    render() {
        const { errorMsg } = this.state;
        const {
            icon,
            style,
            textStyle,
            onIconPress,
            errorMsgStyle,
            containerStyle,
            inputContainerStyle,
        } = this.props;

        return (
            <View style={containerStyle}>
                <View style={[styles.main, inputContainerStyle]}>
                    <View style={[styles.TextInputWrapper, style]}>
                        <TextInput
                            autoCapitalize="none"
                            {...this.props}
                            onChangeText={this.onChangeText}
                            onBlur={this.onBlur}
                            style={[styles.text, textStyle]}

                        />
                    </View>
                    {
                        onIconPress ? (
                            <TouchableOpacity onPress={onIconPress}>
                                {icon && icon(styles.icon)}
                            </TouchableOpacity>
                        ) : (
                                <View>
                                    {icon && icon(styles.icon)}
                                </View>
                            )
                    }
                </View>
                {
                    !!errorMsg && <Text style={[styles.errorMsg, errorMsgStyle]}>{errorMsg}</Text>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        borderColor: 'rgba(255, 255, 255, 0.6)',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 8,
    },
    TextInputWrapper: {
        flex: 1,
        paddingHorizontal: 15,
    },
    text: {
        color: "#000",
        fontSize: 16,
    },
    errorMsg: {
        marginLeft: 5,
        color: '#FFF'
    },
    icon: {
        color: "#FFF",
        fontSize: 20,
    }
})