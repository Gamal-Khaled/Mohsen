package com.mohsen;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;

public class SnowboyBroadcastReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        Toast.makeText(context, "Snowboy Broadcast", Toast.LENGTH_LONG).show();
        showNotification(context);
        //context.startService(new Intent(context, SnowboyService.class));
    }
    private void showNotification(Context context) {
        PendingIntent contentIntent = PendingIntent.getActivity(context, 0,
                new Intent(context, MainActivity.class), 0);

        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(context, "SnowBoy_Channel")
                        .setSmallIcon(R.drawable.notification_icon)
                        .setContentTitle("SnowBoy BroadCast Reciever")
                        .setContentText("BootRecieved w byslm 3lek");
        mBuilder.setContentIntent(contentIntent);
        mBuilder.setDefaults(Notification.DEFAULT_SOUND);
        mBuilder.setAutoCancel(true);
        NotificationManager mNotificationManager =
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
        {
            String channelId = "SnowBoy_Channel";
            NotificationChannel channel = new NotificationChannel(
                    channelId,
                    "Channel for SnowBoy",
                    NotificationManager.IMPORTANCE_HIGH);
            mNotificationManager.createNotificationChannel(channel);
            mBuilder.setChannelId(channelId);
        }
        mNotificationManager.notify(1, mBuilder.build());

    }
}
