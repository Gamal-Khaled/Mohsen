package com.mohsen;

import android.util.Log;
import android.content.Intent;
import android.widget.Toast;
import android.os.Bundle;

import com.facebook.react.bridge.*;
import com.facebook.react.HeadlessJsTaskService;
import android.app.ActivityManager;
import android.content.Context;

public class SnowboyServiceModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    SnowboyServiceModule(ReactApplicationContext context){
        super(context);
        reactContext = context;
    }

    @Override
    public String getName(){
        return "SnowboyServiceModule";
    }

    @ReactMethod
    public void ShowMessage(String message){
        Log.d("SnowboyService Module", message);
    }

    @ReactMethod
    public void startService(){
        reactContext.startService(new Intent(reactContext, SnowboyService.class));
    }
    
    @ReactMethod
    public void stopService(){
        reactContext.stopService(new Intent(reactContext, SnowboyService.class));
    }
    @ReactMethod
    public void startHeadlessService(){
        Intent myIntent = new Intent(reactContext, SnowboyHeadlessTask.class);
        Bundle bundle = new Bundle();
        bundle.putString("foo", "bar");
        myIntent.putExtras(bundle);
        reactContext.startService(myIntent);
        HeadlessJsTaskService.acquireWakeLockNow(reactContext);
    }
    @ReactMethod
    public void isSnowboyServiceRunning(Promise promise) {
        Class<?> serviceClass = SnowboyService.class;
        ActivityManager manager = (ActivityManager) reactContext.getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                promise.resolve(true);
                return;
            }
        }
        promise.resolve(false);
    }
}