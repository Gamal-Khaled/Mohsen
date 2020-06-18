package com.mohsen;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.Handler;
import android.os.IBinder;
import android.os.Message;
import android.widget.Toast;
import androidx.core.app.NotificationCompat;

import com.facebook.react.HeadlessJsTaskService;

import ai.kitt.snowboy.MsgEnum;
import ai.kitt.snowboy.audio.AudioDataSaver;
import ai.kitt.snowboy.audio.RecordingThread;

public class SnowboyService extends Service {
    private RecordingThread recordingThread;
    private boolean isServiceStarted = false;
    private static final String CHANNEL_ID = "SNOWBOY_SERVICE_CHANNEL";

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
        Intent notificationIntent = new Intent("android.intent.start.snowboy");
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Snowboy Listening")
                .setContentText("Snowboy service is running")
                .setSmallIcon(com.reactlibrary.R.mipmap.ic_launcher)
                .setContentIntent(pendingIntent)
                .build();
        startForeground(1, notification);

        recordingThread = new RecordingThread(new Handler() {
            @Override
            public void handleMessage(Message msg) {
                MsgEnum message = MsgEnum.getMsgEnum(msg.what);
                switch(message) {
                    case MSG_ACTIVE:
                        Intent service = new Intent(getApplicationContext(), SnowboyHeadlessTask.class);
                        getApplicationContext().startService(service);
                        HeadlessJsTaskService.acquireWakeLockNow(getApplicationContext());

                        Toast.makeText(getApplicationContext(), "Heared you", Toast.LENGTH_SHORT).show();
                        break;
                }
            }
        }, new AudioDataSaver());
        Toast.makeText(this, "Snowboy service started", Toast.LENGTH_LONG).show();
        recordingThread.startRecording();
        return START_STICKY;
    }


    @Override
    public void onDestroy() {
        super.onDestroy();
        Toast.makeText(this, "Service destroyed", Toast.LENGTH_SHORT).show();
        recordingThread.stopRecording();
    }
}
