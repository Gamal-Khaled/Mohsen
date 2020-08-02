package com.mohsen;

import android.app.Service;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.content.Context;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Build;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;
import com.facebook.react.HeadlessJsTaskService;

import ai.kitt.snowboy.MsgEnum;
import ai.kitt.snowboy.audio.AudioDataSaver;
import ai.kitt.snowboy.audio.RecordingThread;
import ai.kitt.snowboy.AppResCopy;

public class SnowboyService extends Service {
    private RecordingThread recordingThread;
    private Context context;

    @Override
    public void onCreate() {
        super.onCreate();
    }

    public SnowboyService() { }

    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        throw new UnsupportedOperationException("Not yet implemented");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        context = getBaseContext();
        showNotification(getBaseContext());
        AppResCopy.copyResFromAssetsToSD(getBaseContext());
        Handler handler = new Handler() {
            @Override
            public void handleMessage(Message msg) {
                MsgEnum message = MsgEnum.getMsgEnum(msg.what);
                switch(message) {
                    case MSG_ACTIVE:
                    Intent service = new Intent(context, SnowboyHeadlessTask.class);
                    context.startService(service);
                    //HeadlessJsTaskService.acquireWakeLockNow(context);
                    Toast.makeText(context, "Heared you", Toast.LENGTH_SHORT).show();
                    break;
                }
            }
        };
        recordingThread = new RecordingThread(handler, new AudioDataSaver());
        recordingThread.startRecording();
        Toast.makeText(getBaseContext(), "Snowboy service started", Toast.LENGTH_SHORT).show();
        return START_STICKY;
    }
    private void showNotification(Context context) {
        Intent i = new Intent(context, MainActivity.class);
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        PendingIntent contentIntent = PendingIntent.getActivity(context, 0, i, 0);

        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(context, "SnowBoy_Channel")
                        .setSmallIcon(R.drawable.notification_icon)
                        .setContentTitle("SnowBoy Service")
                        .setContentText("SnowBoy Service is Running and listenning for you...");
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
        final Notification notification = mBuilder.build();
        startForeground(7, notification);
    }


    @Override
    public void onDestroy() {
        super.onDestroy();
        Toast.makeText(this, "Service destroyed", Toast.LENGTH_SHORT).show();
        recordingThread.stopRecording();
    }
}
