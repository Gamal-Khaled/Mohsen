import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { EmailIcon, EyeIcon, EyeOffIcon, PersonIcon } from 'common/icons';
import ValidatingInput from 'common/components/ValidatingInput';
import { isEmpty, validateEmail, validatePassword } from 'services/Validator';
import LoadingSpinnerHandler from 'common/components/LoadingSpinnerHandler';
import Button from 'common/components/Button';
import Colors from 'assets/Colors';

export default (): React.ReactElement => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const isValidForm = () => {
        return !isEmpty(userName) && !validateEmail(email) && !validatePassword(password);
    }

    const onSignUpButtonPress = (): void => {

    };

    const onSignInButtonPress = (): void => {
        // props.navigation.navigate('SignInScreen');
    };

    const onPasswordIconPress = (): void => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <LoadingSpinnerHandler
            loading={loading}
            contentContainerStyle={styles.container}
        >
            <Text style={styles.title}>Welcome To Mohsen</Text>
            <View style={styles.formContainer}>
                <ValidatingInput
                    containerStyle={styles.formInput}
                    autoCapitalize='none'
                    placeholder='Username'
                    icon={PersonIcon}

                    value={userName}
                    onChangeText={setUserName}
                    textStyle={styles.inputText}
                    getErrorMessage={v => isEmpty(v, "your username")}
                    placeholderTextColor="#fff"
                />
                <ValidatingInput
                    containerStyle={styles.formInput}
                    autoCapitalize='none'
                    placeholder='Email'
                    icon={EmailIcon}
                    value={email}
                    onChangeText={setEmail}
                    textStyle={styles.inputText}
                    getErrorMessage={validateEmail}
                    placeholderTextColor="#fff"
                />
                <ValidatingInput
                    containerStyle={styles.formInput}
                    autoCapitalize='none'
                    secureTextEntry={!passwordVisible}
                    placeholder='Password'
                    icon={passwordVisible ? EyeIcon : EyeOffIcon}
                    value={password}
                    onChangeText={setPassword}
                    textStyle={styles.inputText}
                    onIconPress={onPasswordIconPress}
                    getErrorMessage={validatePassword}
                    placeholderTextColor="#fff"
                />
            </View>
            <View>
                <Button
                    style={styles.signUpButton}
                    onPress={onSignUpButtonPress}
                    title='Sign Up'
                />
                <Button
                    ghost
                    style={[styles.signInButton]}
                    onPress={onSignInButtonPress}
                    title='Or Sign In'
                    textStyle={styles.haveAccount}
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
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 176,
    },
    editAvatarButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    formContainer: {
        paddingTop: 32,
        paddingHorizontal: 16,
    },
    formInput: {
        marginBottom: 16,
    },
    termsCheckBox: {
        marginTop: 24,
    },
    termsCheckBoxText: {
        color: '#FFF',
    },
    signUpButton: {
        marginHorizontal: 16,
    },
    signInButton: {
        marginVertical: 12,
        marginHorizontal: 16,
    },
    socialAuthContainer: {
        marginTop: 24,
    },
    socialAuthButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    socialAuthHintText: {
        alignSelf: 'center',
        marginBottom: 16,
        color: '#FFF',
    },
    langPickerContainer: {
        width: '100%',
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
    inputText: {
        color: '#fff',
    },
    haveAccount: {
        color: '#fff',
    },
});

