package com.mohsen;

import android.util.Log;
import android.content.Intent;
import android.widget.Toast;
import android.os.Bundle;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.HeadlessJsTaskService;

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
}