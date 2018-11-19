package com.proyecto26.inappbrowser;

import android.app.Activity;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class RNInAppBrowserModule extends ReactContextBaseJavaModule {
  private final RNInAppBrowser inAppBrowser;
  private final ReactApplicationContext reactContext;

  public RNInAppBrowserModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.inAppBrowser = new RNInAppBrowser();
  }

  @Override
  public String getName() {
    return "RNInAppBrowser";
  }

  @ReactMethod
  public void open(final ReadableMap options, final Promise promise) {
    final Activity activity = getCurrentActivity();
    inAppBrowser.open(this.reactContext, options, promise, activity);
  }

  @ReactMethod
  public void close() {
    inAppBrowser.close();
  }
}