package com.proyecto26.inappbrowser;

import android.app.Activity;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = RNInAppBrowserModule.NAME)
public class RNInAppBrowserModule extends ReactContextBaseJavaModule {
  public final static String NAME = "RNInAppBrowser";

  private final RNInAppBrowser inAppBrowser;
  private final ReactApplicationContext reactContext;

  public RNInAppBrowserModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.inAppBrowser = new RNInAppBrowser();
  }

  @Override
  public String getName() {
    return NAME;
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

  @ReactMethod
  public void isAvailable(final Promise promise) {
    inAppBrowser.isAvailable(this.reactContext, promise);
  }
}
