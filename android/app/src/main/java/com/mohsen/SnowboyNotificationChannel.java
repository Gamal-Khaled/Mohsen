package com.mohsen;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;

public class SnowboyNotificationChannel extends Application {
    private static final String CHANNEL_ID = "SNOWBOY_SERVICE_CHANNEL";
    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
    }
    private void createNotificationChannel() {
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O){
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Snowboy service",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(serviceChannel);
        }
    }
}
