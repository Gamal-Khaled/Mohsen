/**
 * @format
 */

import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';

import App from './App';
import SnowboyHeadlessTask from './SnowboyHeadlessTask';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('SnowboyHeadlessTask', () => SnowboyHeadlessTask);