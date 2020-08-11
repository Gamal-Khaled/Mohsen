import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import SnowboyHeadlessTask from './SnowboyHeadlessTask';
import App from './src/App';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('SnowboyHeadlessTask', () => SnowboyHeadlessTask);