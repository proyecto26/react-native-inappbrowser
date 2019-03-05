package com.proyecto26.inappbrowser;

public class ChromeTabsDismissedEvent {
  public final String message;
  public final String url;
  public final String resultType;

  public ChromeTabsDismissedEvent(String url, String message, String resultType) {
    this.url = url;
    this.message = message;
    this.resultType = resultType;
  }
}