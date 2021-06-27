package com.proyecto26.inappbrowser;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import androidx.annotation.Nullable;

import org.greenrobot.eventbus.EventBus;

/**
 * Manages the custom chrome tabs intent by detecting when it is dismissed by the user and allowing
 * to close it programmatically when needed.
 */
public class ChromeTabsManagerActivity extends Activity {
  static final String KEY_BROWSER_INTENT = "browserIntent";
  static final String BROWSER_RESULT_TYPE = "browserResultType";
  static final String DEFAULT_RESULT_TYPE = "dismiss";

  private boolean mOpened = false;
  private String resultType = null;
  private boolean isError = false;

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
    try {
      super.onCreate(savedInstanceState);

      // This activity gets opened in 2 different ways. If the extra KEY_BROWSER_INTENT is present we
      // start that intent and if it is not it means this activity was started with FLAG_ACTIVITY_CLEAR_TOP
      // in order to close the intent that was started previously so we just close this.
      if (getIntent().hasExtra(KEY_BROWSER_INTENT)
        && (savedInstanceState == null || savedInstanceState.getString(BROWSER_RESULT_TYPE) == null)
      ) {
        Intent browserIntent = getIntent().getParcelableExtra(KEY_BROWSER_INTENT);
        browserIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        startActivity(browserIntent);
        resultType = DEFAULT_RESULT_TYPE;
      } else {
        finish();
      }
    } catch (Exception e) {
      isError = true;
      EventBus.getDefault().post(new ChromeTabsDismissedEvent("Unable to open url.", resultType, isError));
      finish();
      e.printStackTrace();
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
      resultType = "cancel";
      finish();
    }
  }

  @Override
  protected void onDestroy() {
    if (resultType != null) {
      switch (resultType) {
        case "cancel":
          EventBus.getDefault().post(new ChromeTabsDismissedEvent("chrome tabs activity closed", resultType, isError));
          break;
        default:
          EventBus.getDefault().post(new ChromeTabsDismissedEvent("chrome tabs activity destroyed", DEFAULT_RESULT_TYPE, isError));
          break;
      }
      resultType = null;
    }
    super.onDestroy();
  }

  @Override
  protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
  }

  @Override
  protected void onRestoreInstanceState(Bundle savedInstanceState) {
    super.onRestoreInstanceState(savedInstanceState);
    resultType = savedInstanceState.getString(BROWSER_RESULT_TYPE);
  }

  @Override
  protected void onSaveInstanceState(Bundle savedInstanceState) {
    savedInstanceState.putString(BROWSER_RESULT_TYPE, DEFAULT_RESULT_TYPE);
    super.onSaveInstanceState(savedInstanceState);
  }
}