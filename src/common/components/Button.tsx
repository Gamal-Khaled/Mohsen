import React, { ReactElement } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    StyleProp,
    TouchableOpacityProps,
    TextStyle,
    Text,
} from "react-native";

interface Props extends TouchableOpacityProps {
    title?: string;
    ghost?: boolean;
    textStyle?: StyleProp<TextStyle>;
    icon?: (props: any) => ReactElement;
    iconStyle?: StyleProp<TextStyle>;
    status?: string;
}

export default (props: Props) => {
    return (
        <TouchableOpacity
            {...props}
            style={[
                styles.container,
                !props.ghost && styles.main,
                props.ghost && styles.ghost,
                props.style,
                // @ts-ignore
                props.status && styles[props.status],
                props.disabled && styles.disabled,
            ]}
        >
            {
                props.title && (
                    <Text
                        style={[
                            styles.text,
                            props.ghost && styles.ghostText,
                            props.textStyle,
                        ]}
                    >
                        {props.title}
                    </Text>
                )
            }
            {
                props.icon && props.icon(props.iconStyle)
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderRadius: 3,
        flexDirection: 'row',
    },
    main: {
        height: 40,
        backgroundColor: '#2699FB',
        justifyContent: "center",
    },
    ghost: {
        justifyContent: "center",
        alignItems: 'center'
    },
    ghostText: {
        color: '#2699fb'
    },
    text: {
        flex: 1,
        fontWeight: 'bold',
        color: "#FFF",
        textAlign: "center",
    },
    disabled: {
        backgroundColor: "#ccc",
        color: "#666",
    },
    danger: {
        backgroundColor: '#FF3D71',
    },
    success: {
        backgroundColor: '#00E096',
    },
})