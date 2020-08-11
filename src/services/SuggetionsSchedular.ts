import BackgroundFetch from "react-native-background-fetch";
import auth from "@react-native-firebase/auth";
import messaging from "@react-native-firebase/messaging";

import FetchWrapper from "./FetchWrapper";

class SuggetionsSchedular {
    start = () => {
        BackgroundFetch.configure({
            minimumFetchInterval: 60,
            forceAlarmManager: true,
            stopOnTerminate: false,
            startOnBoot: true,
            requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
          }, async (taskId) => {
            const fetchWrapper = new FetchWrapper("https://us-central1-mohsen-f7115.cloudfunctions.net/makeSuggestion");
            fetchWrapper.post("/", {
                userId: auth().currentUser?.uid,
                time: new Date().getHours(),
                fcmToken: await messaging().getToken(),
            });

            BackgroundFetch.finish(taskId);
          }, (error) => {
            console.log("[js] RNBackgroundFetch failed to start");
          });
    }
}

export default new SuggetionsSchedular();