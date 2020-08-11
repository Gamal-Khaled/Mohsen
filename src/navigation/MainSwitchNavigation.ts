import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import AuthSwitchNavigation from 'navigation/AuthSwitchNavigation';
import ChatScreen from 'screens/chat/ChatScreen';

export default createAppContainer(createSwitchNavigator({
    AuthSwitchNavigation,
    ChatScreen,
}));