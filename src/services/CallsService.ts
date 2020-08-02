import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { PermissionsAndroid } from 'react-native';
import CommandResponse from 'models/CommandResponse';

class CallsService {
    initialize = async () => {
        await this.requestPermissions();
    }

    requestPermissions = async () => {
        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CALL_PHONE);
    }

    makePhoneCall = async (phoneNumber: string): Promise<CommandResponse> => {
        const permissionStatus = await this.requestPermissions()
        if (permissionStatus === 'granted') {
            RNImmediatePhoneCall.immediatePhoneCall(phoneNumber);

            return {
                done: true,
            }
        } else {
            return {
                done: false,
                message: "I didn't have the permission to do that.",
            }
        }
    }
}

export default new CallsService();