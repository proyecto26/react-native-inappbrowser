
package com.proyecto26.inappbrowser;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.support.annotation.Nullable;
import android.support.customtabs.CustomTabsIntent;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import de.greenrobot.event.EventBus;

public class RNInAppBrowserModule extends ReactContextBaseJavaModule {
  private final static String ERROR_CODE = "InAppBrowser";
  private final ReactApplicationContext reactContext;

  private @Nullable Promise mOpenBrowserPromise;

  public RNInAppBrowserModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNInAppBrowser";
  }

  @ReactMethod
  public void open(final String url, final Promise promise) {
    if (mOpenBrowserPromise != null) {
      WritableMap result = Arguments.createMap();
      result.putString("type", "cancel");
      mOpenBrowserPromise.resolve(result);
      return;
    }
    mOpenBrowserPromise = promise;

    final Activity activity = getCurrentActivity();
    if (activity == null) {
      promise.reject(ERROR_CODE, "No activity");
      mOpenBrowserPromise = null;
      return;
    }

    CustomTabsIntent.Builder builder = new CustomTabsIntent.Builder();
    CustomTabsIntent customTabsIntent = builder.build();

    Intent intent = customTabsIntent.intent;
    intent.setData(Uri.parse(url));
    intent.putExtra(CustomTabsIntent.EXTRA_TITLE_VISIBILITY_STATE, CustomTabsIntent.NO_TITLE);

    EventBus.getDefault().register(this);

    activity.startActivity(
        ChromeTabsManagerActivity.createStartIntent(activity, intent));
  }

  @ReactMethod
  public void close() {
    if (mOpenBrowserPromise == null) {
      return;
    }

    final Activity activity = getCurrentActivity();
    if (activity == null) {
      mOpenBrowserPromise.reject(ERROR_CODE, "No activity");
      mOpenBrowserPromise = null;
      return;
    }

    EventBus.getDefault().unregister(this);

    WritableMap result = Arguments.createMap();
    result.putString("type", "dismiss");
    mOpenBrowserPromise.resolve(result);
    mOpenBrowserPromise = null;

    activity.startActivity(
        ChromeTabsManagerActivity.createDismissIntent(activity));
  }

  public void onEvent(ChromeTabsManagerActivity.ChromeTabsDismissedEvent event) {
    EventBus.getDefault().unregister(this);

    Assertions.assertNotNull(mOpenBrowserPromise);

    WritableMap result = Arguments.createMap();
    result.putString("type", "cancel");
    mOpenBrowserPromise.resolve(result);
    mOpenBrowserPromise = null;
  }
}