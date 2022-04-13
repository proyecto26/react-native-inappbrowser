package com.example;

import com.facebook.react.ReactActivity;
import com.proyecto26.inappbrowser.RNInAppBrowserModule;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "example";
  }

  @Override
  protected void onStart() {
    super.onStart();
   RNInAppBrowserModule.onStart(this);
  }
}
