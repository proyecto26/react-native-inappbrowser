package com.proyecto26.inappbrowser;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.support.annotation.Nullable;
import android.support.customtabs.CustomTabsIntent;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;

public class RNInAppBrowser {
  private final static String ERROR_CODE = "InAppBrowser";
  private static final String KEY_TOOLBAR_COLOR = "toolbarColor";
  private static final String KEY_SECONDARY_TOOLBAR_COLOR = "secondaryToolbarColor";
  private static final String KEY_ENABLE_URL_BAR_HIDING = "enableUrlBarHiding";
  private static final String KEY_SHOW_PAGE_TITLE = "showTitle";
  private static final String KEY_DEFAULT_SHARE_MENU_ITEM = "enableDefaultShare";

  private @Nullable Promise mOpenBrowserPromise;
  private Activity currentActivity;

  public void open(final ReadableMap options, final Promise promise, Activity activity) {
    final String url = options.getString("url");
    currentActivity = activity;
    if (mOpenBrowserPromise != null) {
      WritableMap result = Arguments.createMap();
      result.putString("type", "cancel");
      mOpenBrowserPromise.resolve(result);
      return;
    }
    mOpenBrowserPromise = promise;

    if (currentActivity == null) {
      mOpenBrowserPromise.reject(ERROR_CODE, "No activity");
      mOpenBrowserPromise = null;
      return;
    }

    CustomTabsIntent.Builder builder = new CustomTabsIntent.Builder();
    if (options.hasKey(KEY_TOOLBAR_COLOR)) {
      final String colorString = options.getString(KEY_TOOLBAR_COLOR);
      try {
        builder.setToolbarColor(Color.parseColor(colorString));
      } catch (IllegalArgumentException e) {
        throw new JSApplicationIllegalArgumentException(
                "Invalid toolbar color '" + colorString + "': " + e.getMessage());
      }
    }
    if (options.hasKey(KEY_SECONDARY_TOOLBAR_COLOR)) {
      final String colorString = options.getString(KEY_SECONDARY_TOOLBAR_COLOR);
      try {
        builder.setSecondaryToolbarColor(Color.parseColor(colorString));
      } catch (IllegalArgumentException e) {
        throw new JSApplicationIllegalArgumentException(
                "Invalid secondary toolbar color '" + colorString + "': " + e.getMessage());
      }
    }
    if (options.hasKey(KEY_ENABLE_URL_BAR_HIDING) && options.getBoolean(KEY_ENABLE_URL_BAR_HIDING)) {
      builder.enableUrlBarHiding();
    }
    if (options.hasKey(KEY_DEFAULT_SHARE_MENU_ITEM) && options.getBoolean(KEY_DEFAULT_SHARE_MENU_ITEM)) {
      builder.addDefaultShareMenuItem();
    }
    CustomTabsIntent customTabsIntent = builder.build();

    Intent intent = customTabsIntent.intent;
    intent.setData(Uri.parse(url));
    if (options.hasKey(KEY_SHOW_PAGE_TITLE)) {
      builder.setShowTitle(options.getBoolean(KEY_SHOW_PAGE_TITLE));
    }
    else {
      intent.putExtra(CustomTabsIntent.EXTRA_TITLE_VISIBILITY_STATE, CustomTabsIntent.NO_TITLE);
    }

    EventBus.getDefault().register(this);

    currentActivity.startActivity(
        ChromeTabsManagerActivity.createStartIntent(currentActivity, intent));
  }

  public void close() {
    if (mOpenBrowserPromise == null) {
      return;
    }
    
    if (currentActivity == null) {
      mOpenBrowserPromise.reject(ERROR_CODE, "No activity");
      mOpenBrowserPromise = null;
      return;
    }

    EventBus.getDefault().unregister(this);

    WritableMap result = Arguments.createMap();
    result.putString("type", "dismiss");
    mOpenBrowserPromise.resolve(result);
    mOpenBrowserPromise = null;

    currentActivity.startActivity(
        ChromeTabsManagerActivity.createDismissIntent(currentActivity));
  }

  @Subscribe
  public void onEvent(ChromeTabsDismissedEvent event) {
    EventBus.getDefault().unregister(this);

    Assertions.assertNotNull(mOpenBrowserPromise);

    WritableMap result = Arguments.createMap();
    result.putString("type", "cancel");
    mOpenBrowserPromise.resolve(result);
    mOpenBrowserPromise = null;
  }
}