package com.proyecto26.inappbrowser;

import android.app.Activity;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = RNInAppBrowserModule.NAME)
public class RNInAppBrowserModule extends ReactContextBaseJavaModule {
  public final static String NAME = "RNInAppBrowser";

  private final ReactApplicationContext reactContext;

  public RNInAppBrowserModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void open(final ReadableMap options, final Promise promise) {
    final Activity activity = getCurrentActivity();
    RNInAppBrowser.getInstance().open(this.reactContext, options, promise, activity);
  }

  @ReactMethod
  public void close() {
    RNInAppBrowser.getInstance().close();
  }

  @ReactMethod
  public void isAvailable(final Promise promise) {
    RNInAppBrowser.getInstance().isAvailable(this.reactContext, promise);
  }

  public static void onStart(final Activity activity) {
    RNInAppBrowser.getInstance().onStart(activity);
  }

  @ReactMethod
  public void warmup(final Promise promise) {
    RNInAppBrowser.getInstance().warmup(promise);
  }

  @ReactMethod
  public void mayLaunchUrl(final String mostLikelyUrl, final ReadableArray otherUrls) {
    RNInAppBrowser.getInstance().mayLaunchUrl(mostLikelyUrl, otherUrls);
  }

}
