import { createSwitchNavigator } from 'react-navigation';

import SignInScreen from 'screens/signIn/SignInScreen';
import SignUpScreen from 'screens/signUp/SignUpScreen';

export default createSwitchNavigator({
    SignInScreen,
    SignUpScreen,
});