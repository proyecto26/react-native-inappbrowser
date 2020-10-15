package com.proyecto26.inappbrowser;

import android.R.anim;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ResolveInfo;
import android.graphics.Color;
import android.graphics.BitmapFactory;
import android.provider.Browser;
import androidx.annotation.Nullable;
import androidx.browser.customtabs.CustomTabsClient;
import androidx.browser.customtabs.CustomTabsIntent;
import androidx.core.graphics.ColorUtils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;

import java.util.Arrays;
import java.util.regex.Pattern;
import java.util.List;

public class RNInAppBrowser {
  private final static String ERROR_CODE = "InAppBrowser";
  private static final String KEY_TOOLBAR_COLOR = "toolbarColor";
  private static final String KEY_SECONDARY_TOOLBAR_COLOR = "secondaryToolbarColor";
  private static final String KEY_ENABLE_URL_BAR_HIDING = "enableUrlBarHiding";
  private static final String KEY_SHOW_PAGE_TITLE = "showTitle";
  private static final String KEY_DEFAULT_SHARE_MENU_ITEM = "enableDefaultShare";
  private static final String KEY_FORCE_CLOSE_ON_REDIRECTION = "forceCloseOnRedirection";
  private static final String KEY_ANIMATIONS = "animations";
  private static final String KEY_HEADERS = "headers";
  private static final String KEY_ANIMATION_START_ENTER = "startEnter";
  private static final String KEY_ANIMATION_START_EXIT = "startExit";
  private static final String KEY_ANIMATION_END_ENTER = "endEnter";
  private static final String KEY_ANIMATION_END_EXIT = "endExit";
  private static final String KEY_HAS_BACK_BUTTON = "hasBackButton";
  private static final String KEY_BROWSER_PACKAGE = "browserPackage";
  private static final String KEY_SHOW_IN_RECENTS = "showInRecents";

  private static final String ACTION_CUSTOM_TABS_CONNECTION = "android.support.customtabs.action.CustomTabsService";
  private static final String CHROME_PACKAGE_STABLE = "com.android.chrome";
  private static final String CHROME_PACKAGE_BETA = "com.chrome.beta";
  private static final String CHROME_PACKAGE_DEV = "com.chrome.dev";
  private static final String LOCAL_PACKAGE = "com.google.android.apps.chrome";

  private @Nullable Promise mOpenBrowserPromise;
  private Boolean isLightTheme;
  private Activity currentActivity;
  private static final Pattern animationIdentifierPattern = Pattern.compile("^.+:.+/");

  public void open(Context context, final ReadableMap options, final Promise promise, Activity activity) {
    final String url = options.getString("url");
    currentActivity = activity;
    if (mOpenBrowserPromise != null) {
      WritableMap result = Arguments.createMap();
      result.putString("type", "cancel");
      mOpenBrowserPromise.resolve(result);
      mOpenBrowserPromise = null;
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
        isLightTheme = toolbarIsLight(colorString);
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
    if (options.hasKey(KEY_DEFAULT_SHARE_MENU_ITEM) && 
        options.getBoolean(KEY_DEFAULT_SHARE_MENU_ITEM)) {
      builder.addDefaultShareMenuItem();
    }
    if (options.hasKey(KEY_ANIMATIONS)) {
      final ReadableMap animations = options.getMap(KEY_ANIMATIONS);
      applyAnimation(context, builder, animations);
    }
    if (options.hasKey(KEY_HAS_BACK_BUTTON) &&
        options.getBoolean(KEY_HAS_BACK_BUTTON)) {
      builder.setCloseButtonIcon(BitmapFactory.decodeResource(
        context.getResources(),
        isLightTheme ? R.drawable.ic_arrow_back_black : R.drawable.ic_arrow_back_white
      ));
    }

    CustomTabsIntent customTabsIntent = builder.build();
    Intent intent = customTabsIntent.intent;

    if (options.hasKey(KEY_HEADERS)) {
      ReadableMap readableMap = options.getMap(KEY_HEADERS);

      if (readableMap != null) {
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        if (iterator.hasNextKey()) {
          Bundle headers = new Bundle();
          while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            ReadableType readableType = readableMap.getType(key);
            switch (readableType) {
              case String:
                headers.putString(key, readableMap.getString(key));
                break;
              default:
                break;
            }
          }
          intent.putExtra(Browser.EXTRA_HEADERS, headers);
        }
      }
    }

    if (options.hasKey(KEY_FORCE_CLOSE_ON_REDIRECTION) &&
        options.getBoolean(KEY_FORCE_CLOSE_ON_REDIRECTION)) {
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    }
    if (!options.hasKey(KEY_SHOW_IN_RECENTS) ||
        !options.getBoolean(KEY_SHOW_IN_RECENTS)) {
      intent.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
      intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
    }

    intent.putExtra(CustomTabsIntent.EXTRA_ENABLE_URLBAR_HIDING, (
      options.hasKey(KEY_ENABLE_URL_BAR_HIDING) && 
      options.getBoolean(KEY_ENABLE_URL_BAR_HIDING)));
    try {
      if (options.hasKey(KEY_BROWSER_PACKAGE)) {
        final String packageName = options.getString(KEY_BROWSER_PACKAGE);
        if (!TextUtils.isEmpty(packageName)) {
          intent.setPackage(packageName);
        }
      } else {
        final String packageName = getDefaultBrowser(currentActivity);
        intent.setPackage(packageName);
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    
    intent.setData(Uri.parse(url));
    if (options.hasKey(KEY_SHOW_PAGE_TITLE)) {
      builder.setShowTitle(options.getBoolean(KEY_SHOW_PAGE_TITLE));
    }
    else {
      intent.putExtra(CustomTabsIntent.EXTRA_TITLE_VISIBILITY_STATE, CustomTabsIntent.NO_TITLE);
    }

    registerEventBus();

    currentActivity.startActivity(
        ChromeTabsManagerActivity.createStartIntent(currentActivity, intent),
        customTabsIntent.startAnimationBundle);
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

    unRegisterEventBus();

    WritableMap result = Arguments.createMap();
    result.putString("type", "dismiss");
    mOpenBrowserPromise.resolve(result);
    mOpenBrowserPromise = null;

    currentActivity.startActivity(
        ChromeTabsManagerActivity.createDismissIntent(currentActivity));
  }

  public void isAvailable(Context context, final Promise promise) {
    List<ResolveInfo> resolveInfos = getPreferredPackages(context);
    promise.resolve(!(resolveInfos == null || resolveInfos.isEmpty()));
  }

  @Subscribe
  public void onEvent(ChromeTabsDismissedEvent event) {
    unRegisterEventBus();

    if (mOpenBrowserPromise == null) {
      throw new AssertionError();
    }

    WritableMap result = Arguments.createMap();
    result.putString("type", event.resultType);
    mOpenBrowserPromise.resolve(result);
    mOpenBrowserPromise = null;
  }

  void applyAnimation(Context context, CustomTabsIntent.Builder builder, ReadableMap animations) {
    final int startEnterAnimationId = animations.hasKey(KEY_ANIMATION_START_ENTER)
            ? resolveAnimationIdentifierIfNeeded(context, animations.getString(KEY_ANIMATION_START_ENTER))
            : -1;
    final int startExitAnimationId = animations.hasKey(KEY_ANIMATION_START_EXIT)
            ? resolveAnimationIdentifierIfNeeded(context, animations.getString(KEY_ANIMATION_START_EXIT))
            : -1;
    final int endEnterAnimationId = animations.hasKey(KEY_ANIMATION_END_ENTER)
            ? resolveAnimationIdentifierIfNeeded(context, animations.getString(KEY_ANIMATION_END_ENTER))
            : -1;
    final int endExitAnimationId = animations.hasKey(KEY_ANIMATION_END_EXIT)
            ? resolveAnimationIdentifierIfNeeded(context, animations.getString(KEY_ANIMATION_END_EXIT))
            : -1;

    if (startEnterAnimationId != -1 && startExitAnimationId != -1) {
      builder.setStartAnimations(context, startEnterAnimationId, startExitAnimationId);
    }

    if (endEnterAnimationId != -1 && endExitAnimationId != -1) {
      builder.setExitAnimations(context, endEnterAnimationId, endExitAnimationId);
    }
  }

  private int resolveAnimationIdentifierIfNeeded(Context context, String identifier) {
    if (animationIdentifierPattern.matcher(identifier).find()) {
      return context.getResources().getIdentifier(identifier, null, null);
    } else {
      return context.getResources().getIdentifier(identifier, "anim", context.getPackageName());
    }
  }

  private void registerEventBus() {
    if (!EventBus.getDefault().isRegistered(this)) {
      EventBus.getDefault().register(this);
    }
  }

  private void unRegisterEventBus() {
    if (EventBus.getDefault().isRegistered(this)) {
      EventBus.getDefault().unregister(this);
    }
  }

  private Boolean toolbarIsLight(String themeColor) {
    return ColorUtils.calculateLuminance(Color.parseColor(themeColor)) > 0.5;
  }

  private List<ResolveInfo> getPreferredPackages(Context context) {
    Intent serviceIntent = new Intent(ACTION_CUSTOM_TABS_CONNECTION);
    List<ResolveInfo> resolveInfos = context.getPackageManager().queryIntentServices(serviceIntent, 0);
    return resolveInfos;
  }

  private String getDefaultBrowser(Context context) {
    List<ResolveInfo> resolveInfos = getPreferredPackages(context);
    String packageName = CustomTabsClient.getPackageName(context,
      Arrays.asList(CHROME_PACKAGE_STABLE, CHROME_PACKAGE_BETA, CHROME_PACKAGE_DEV, LOCAL_PACKAGE));
    if(packageName == null && resolveInfos != null && resolveInfos.size() > 0){
      packageName = resolveInfos.get(0).serviceInfo.packageName;
    }
    return packageName;
  }
}
