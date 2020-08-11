import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import {
    EyeIcon,
    EyeOffIcon,
    PersonIcon,
} from 'common/icons';
import Button from 'common/components/Button';
import ValidatingInput from 'common/components/ValidatingInput';
import LoadingSpinnerHandler from 'common/components/LoadingSpinnerHandler';
import { validatePassword, validateEmail } from 'services/Validator';
import Colors from 'assets/Colors';

export default (): React.ReactElement => {
    const [email, setEmail] = React.useState(__DEV__ ? "gamal.khaled11@gmail.com" : "");
    const [password, setPassword] = React.useState(__DEV__ ? "12345678" : "");
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    let inputs: ValidatingInput[] = [];

    const isValidForm = () => {
        return !validateEmail(email) && !validatePassword(password);
    }

    const onSignInButtonPress = async () => {

    };

    const onSignUpButtonPress = (): void => {
        // props.navigation.navigate('SignUpScreen');
    };

    const onPasswordIconPress = (): void => {
        setPasswordVisible(!passwordVisible);
    };

    const saveInputRef = (ref: ValidatingInput) => inputs.push(ref);

    return (
        <LoadingSpinnerHandler
            loading={loading}
            contentContainerStyle={styles.container}
        >
            <Text style={styles.title}>Welcome To Mohsen</Text>
            <View style={styles.formContainer}>
                <ValidatingInput
                    placeholder='Email'
                    icon={PersonIcon}
                    value={email}
                    onChangeText={setEmail}
                    getErrorMessage={validateEmail}
                    ref={saveInputRef}
                    textStyle={styles.inputText}
                    placeholderTextColor="#fff"
                />
                <ValidatingInput
                    containerStyle={styles.passwordInput}
                    placeholder='Password'
                    value={password}
                    icon={passwordVisible ? EyeOffIcon : EyeIcon}
                    secureTextEntry={!passwordVisible}
                    onChangeText={setPassword}
                    onIconPress={onPasswordIconPress}
                    getErrorMessage={validatePassword}
                    ref={saveInputRef}
                    textStyle={styles.inputText}
                    placeholderTextColor="#fff"
                />
            </View>
            <View>
                <Button
                    style={styles.signInButton}
                    onPress={onSignInButtonPress}
                    title='Sign In'
                />
                <Button
                    ghost
                    style={styles.signUpButton}
                    onPress={onSignUpButtonPress}
                    textStyle={styles.dontHaveAccount}
                    title='Or SignUp'
                />
            </View>
        </LoadingSpinnerHandler>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
        justifyContent: "space-around",
    },
    title: {
        color: Colors.primaryText,
        textAlign: 'center',
        fontSize: 25,
        fontWeight: 'bold',
    },
    headerContainer: {
        minHeight: 216,
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        paddingHorizontal: 16,
    },
    signInLabel: {
        marginTop: 16,
        color: '#FFF',
    },
    passwordInput: {
        marginTop: 16,
    },
    signInButton: {
        marginHorizontal: 16,
    },
    forgotPasswordButton: {
        paddingHorizontal: 0,
        marginVertical: 15,
    },
    signUpButton: {
        marginVertical: 12,
    },
    signUpButtonText: {
        color: "#FFF",
    },
    socialAuthContainer: {
        marginTop: 32,
    },
    socialAuthButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    socialAuthHintText: {
        alignSelf: 'center',
        marginBottom: 16,
        color: "#FFF",
    },
    langPickerContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    langPicker: {
        width: 200,
        borderColor: "#fff",
    },
    langPickerText: {
        color: "#fff",
    },
    socialIcon: {
        color: "#FFF",
        fontSize: 20,
        marginVertical: 20,
    },
    forgotPasswordText: {
        textAlign: 'right',
        color: '#fff',
    },
    inputText: {
        color: '#fff',
    },
    dontHaveAccount: {
        color: '#fff',
    },
});
