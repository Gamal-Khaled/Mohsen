import RNImmediatePhoneCall from 'react-native-immediate-phone-call';

class CallsService {
    makePhoneCall = (phoneNumber: string) => {
        RNImmediatePhoneCall.immediatePhoneCall(phoneNumber);
    }
}

export default new CallsService();