package com.proyecto26.inappbrowser;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import androidx.annotation.Nullable;
import android.util.Log;

import org.greenrobot.eventbus.EventBus;

/**
 * Manages the custom chrome tabs intent by detecting when it is dismissed by the user and allowing
 * to close it programmatically when needed.
 */
public class ChromeTabsManagerActivity extends Activity {
  static final String KEY_BROWSER_INTENT = "browserIntent";
  static final String CHROME_PACKAGE_NAME = "com.android.chrome";
  static final String CHROME_CLASS_NAME = "com.google.android.apps.chrome.IntentDispatcher";
  static final String FIREFOX_PACKAGE_NAME = "org.mozilla.firefox";
  static final String FIREFOX_CLASS_NAME = "org.mozilla.firefox.App";
  static final String YBROWSER_PACKAGE_NAME = "jp.co.yahoo.android.ybrowser";
  static final String YBROWSER_CLASS_NAME = "jp.co.yahoo.android.ybrowser.YBrowserBrowserActivity";
  static final String YAHOO_JAPAN_PACKAGE_NAME = "jp.co.yahoo.android.yjtop";
  static final String YAHOO_JAPAN_CLASS_NAME = "jp.co.yahoo.android.yjtop.browser.BrowserActivity";

  private boolean mOpened = false;

  public static Intent createStartIntent(Context context, Intent authIntent) {
    Intent intent = createBaseIntent(context);
    intent.putExtra(KEY_BROWSER_INTENT, authIntent);
    return intent;
  }

  public static Intent createDismissIntent(Context context) {
    Intent intent = createBaseIntent(context);
    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
    return intent;
  }

  private static Intent createBaseIntent(Context context) {
    return new Intent(context, ChromeTabsManagerActivity.class);
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // This activity gets opened in 2 different ways. If the extra KEY_BROWSER_INTENT is present we
    // start that intent and if it is not it means this activity was started with FLAG_ACTIVITY_CLEAR_TOP
    // in order to close the intent that was started previously so we just close this.
    if (getIntent().hasExtra(KEY_BROWSER_INTENT)) {
      Intent browserIntent = getIntent().getParcelableExtra(KEY_BROWSER_INTENT);
      browserIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);

      ComponentName name = browserIntent.resolveActivity(getPackageManager());
      if (name.getPackageName().equals(CHROME_PACKAGE_NAME) && name.getClassName().equals(CHROME_CLASS_NAME)
              || name.getPackageName().equals(FIREFOX_PACKAGE_NAME) && name.getClassName().equals(FIREFOX_CLASS_NAME)
              || name.getPackageName().equals(YBROWSER_PACKAGE_NAME) && name.getClassName().equals(YBROWSER_CLASS_NAME))
              || name.getPackageName().equals(YAHOO_JAPAN_PACKAGE_NAME) && name.getClassName().equals((YAHOO_JAPAN_CLASS_NAME)) {
        startActivity(browserIntent);
      }
    } else {
      finish();
    }
  }

  @Override
  protected void onResume() {
    super.onResume();

    // onResume will get called twice, the first time when the activity is created and a second
    // time if the user closes the chrome tabs activity. Knowing this we can detect if the user
    // dismissed the activity and send an event accordingly.
    if (!mOpened) {
      mOpened = true;
    } else {
      if(getIntent().getData() != null) {
        String url = getIntent().getData().toString();
        EventBus.getDefault().post(new ChromeTabsDismissedEvent(url, "chrome tabs activity closed", "success"));
      } else {
        EventBus.getDefault().post(new ChromeTabsDismissedEvent(null, "chrome tabs activity closed", "cancel"));
      }
      finish();
    }
  }

  @Override
  protected void onDestroy() {
    EventBus.getDefault().post(new ChromeTabsDismissedEvent(null, "chrome tabs activity destroyed", "dismiss"));
    super.onDestroy();
  }

  @Override
  protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
  }
}
