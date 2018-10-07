package com.proyecto26.inappbrowser;

public class ChromeTabsDismissedEvent {
  public final String message;
  public final String resultType;

  public ChromeTabsDismissedEvent(String message, String resultType) {
    this.message = message;
    this.resultType = resultType;
  }
}