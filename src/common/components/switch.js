import React, { Component } from 'react';
import {
    Text,
    TouchableWithoutFeedback,
    View,
    Animated,
    StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import Colors from 'assets/Colors';

class Switch extends Component {
    static propTypes = {
        value: PropTypes.bool,
        onChangeValue: PropTypes.func,
        activeText: PropTypes.string,
        inactiveText: PropTypes.string,
        fontSize: PropTypes.number,
        activeTextColor: PropTypes.string,
        inactiveTextColor: PropTypes.string,
        switchWidth: PropTypes.number,
        switchHeight: PropTypes.number,
        switchBorderRadius: PropTypes.number,
        switchBorderWidth: PropTypes.number,
        buttonWidth: PropTypes.number,
        buttonHeight: PropTypes.number,
        buttonBorderRadius: PropTypes.number,
        buttonBorderColor: PropTypes.string,
        buttonBorderWidth: PropTypes.number,
        animationTime: PropTypes.number,
        padding: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
        shadowColor: PropTypes.string,
        shadowOffset: PropTypes.object,
        shadowRadius: PropTypes.number,
        shadowOpacity: PropTypes.number,
    };

    static defaultProps = {
        value: false,
        onChangeValue: () => null,
        activeText: '',
        inactiveText: '',
        fontSize: 16,
        activeTextColor: 'rgba(255, 255, 255, 1)',
        inactiveTextColor: 'rgba(255, 255, 255, 1)',
        switchWidth: 50,
        switchHeight: 20,
        switchBorderRadius: 15,
        switchBorderWidth: 1,
        buttonWidth: 16,
        buttonHeight: 16,
        buttonBorderRadius: 15,
        buttonBorderColor: 'rgba(0, 0, 0, 1)',
        buttonBorderWidth: 0,
        animationTime: 150,
        padding: false,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 0,
        shadowOpacity: 1,
    }

    constructor(props, context) {
        super(props, context);
        this.padding = (props.switchWidth / -2) + (props.buttonWidth / 2) + 2;
        this.transformValue = (props.switchWidth / 2) - (props.buttonWidth / 2) - 2;
        this.state = {
            transformValue: new Animated.Value(props.value ? this.transformValue : this.padding)
        };
    }

    componentDidUpdate(prevProps) {
        const { value } = this.props;
        if (value !== prevProps) this.startGroupAnimations();
    }

    startGroupAnimations = () => {
        const { animationTime, value } = this.props;

        Animated.spring(this.state.transformValue, {
            toValue: value ? this.transformValue : this.padding,
            duration: animationTime,
            useNativeDriver: true
        }).start();
    }

    render() {
        const {
            transformValue,
        } = this.state;

        const {
            value,
            onChangeValue,
            activeText,
            inactiveText,
            fontSize,
            activeTextColor,
            inactiveTextColor,
            switchWidth,
            switchHeight,
            switchBorderRadius,
            switchBorderWidth,
            buttonWidth,
            buttonHeight,
            buttonBorderRadius,
            buttonBorderColor,
            buttonBorderWidth,
            shadowColor,
            shadowOffset,
            shadowRadius,
            shadowOpacity
        } = this.props;

        const containerHeight = switchHeight > buttonHeight ? switchHeight : buttonHeight;
        const containerWidth = switchWidth > buttonWidth ? switchWidth : buttonWidth;

        return (
            <TouchableWithoutFeedback
                onPress={onChangeValue}
            >
                <View
                    style={[
                        styles.container,
                        {
                            height: containerHeight,
                            width: containerWidth,
                        }
                    ]}
                >
                    <Animated.View
                        style={{
                            backgroundColor: value ? Colors.accent : Colors.primary,
                            height: switchHeight,
                            width: switchWidth,
                            borderRadius: switchBorderRadius,
                            borderWidth: switchBorderWidth,
                            borderColor: Colors.accent,
                            zIndex: 1,
                            position: 'absolute',
                            top: (containerHeight - switchHeight) / 2,
                            left: (containerWidth - switchWidth) / 2,
                        }}
                    >
                        <View style={styles.animatedContainer}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: activeTextColor, fontSize }}>
                                    {value ? activeText : ''}
                                </Text>
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={{ color: inactiveTextColor, fontSize }}>
                                    {value ? '' : inactiveText}
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                    <Animated.View
                        style={{
                            backgroundColor: value ? '#fff' : Colors.accent,
                            borderRadius: buttonBorderRadius,
                            borderWidth: buttonBorderWidth,
                            borderColor: buttonBorderColor,
                            width: buttonWidth,
                            height: buttonHeight,
                            zIndex: 3,
                            position: 'absolute',
                            top: (containerHeight - buttonHeight) / 2,
                            shadowColor: shadowColor,
                            shadowOpacity: shadowOpacity,
                            shadowOffset: shadowOffset,
                            shadowRadius: shadowRadius,
                            transform: [{translateX: transformValue}]
                        }}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'column',
    },
    animatedContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Switch;