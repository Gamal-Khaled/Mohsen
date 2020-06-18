import { PermissionsAndroid } from "react-native";

import snowboy from "react-native-snowboy";

class SnowboyService {
    initialized = false;
    recording = false;

    initialize = async () => {
        const permissions = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
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
            snowboy.startRecording();
        }
    }

    stop = () => {
        if (this.initialized && this.recording) {
            this.recording = false;
            snowboy.stopRecording();
        }
    }

    addEventListener = (event: string, callback: (e: any) => void) => {
        console.log("addEventListener", this.initialized, snowboy.addEventListener)
        if (this.initialized) {
            snowboy.addEventListener(event, callback);
        }
    }
}

export default new SnowboyService();