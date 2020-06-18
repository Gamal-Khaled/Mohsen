package com.mohsen;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;

public class SnowboyBroadcastReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        //notification
        Notification notification = new NotificationCompat.Builder(context)
                .setContentTitle("Mohsen")
                .setContentText("I hear you")
                .setSmallIcon(com.reactlibrary.R.mipmap.ic_launcher)
                .build();
        NotificationManager notificationManager =
                (NotificationManager) context.getSystemService(Service.NOTIFICATION_SERVICE);
        notificationManager.notify(7, notification);

        Toast.makeText(context, "Broadcast onReceive", Toast.LENGTH_LONG).show();
        // context.startService(new Intent(context, SnowboyService.class));
    }
}
