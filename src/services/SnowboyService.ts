import { PermissionsAndroid } from "react-native";

import snowboy from "react-native-snowboy";

class SnowboyService {
    initialized = false;
    recording = false;

    initialize = async () => {
        const permissions = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ])
        let granted = true;
        Object.keys(permissions).forEach(permissionKey => {
            granted = granted && (permissions[permissionKey] == "granted")
        });

        if (granted) {
            this.initialized = true;
            return snowboy.initHotword();
        }
    }

    start = () => {
        if (this.initialized && !this.recording) {
            this.recording = true;
            return snowboy.startRecording();
        }
    }

    stop = () => {
        if (this.initialized && this.recording) {
            this.recording = false;
            return snowboy.stopRecording();
        }
    }

    addEventListener = (event: string, callback: (e: any) => void) => {
        if (this.initialized) {
            return snowboy.addEventListener(event, callback);
        }
    }

    removeAllListeners = (event: string) => {
        return snowboy.removeAllListeners(event);
    }
}

export default new SnowboyService();