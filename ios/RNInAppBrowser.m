#import "RNInAppBrowser.h"

#if __has_include(<React/RCTUtils.h>) // React Native >= 0.40
#import <React/RCTUtils.h>
#else // React Native < 0.40
#import "RCTUtils.h"
#endif
#if __has_include(<React/RCTConvert.h>) // React Native >= 0.40
#import <React/RCTConvert.h>
#else // React Native < 0.40
#import "RCTConvert.h"
#endif
#import <SafariServices/SafariServices.h>
#if __has_include("AuthenticationServices/AuthenticationServices.h")
#import <AuthenticationServices/AuthenticationServices.h>
#endif

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wpartial-availability"
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
@interface RNInAppBrowser () <SFSafariViewControllerDelegate, ASWebAuthenticationPresentationContextProviding, UIAdaptivePresentationControllerDelegate>
#else
@interface RNInAppBrowser () <SFSafariViewControllerDelegate, UIAdaptivePresentationControllerDelegate>
#endif
@end
#pragma clang diagnostic pop

NSString *RNInAppBrowserErrorCode = @"RNInAppBrowser";

@implementation RNInAppBrowser

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wpartial-availability"
static SFAuthenticationSession *authSession API_AVAILABLE(ios(11.0)) API_DEPRECATED("Use ASWebAuthenticationSession instead", ios(11.0, 12.0));
#pragma clang diagnostic pop

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wpartial-availability"
static ASWebAuthenticationSession *webAuthSession API_AVAILABLE(ios(12.0));
#pragma clang diagnostic pop

static SFSafariViewController *safariVC;
static RCTPromiseResolveBlock redirectResolve;
static RCTPromiseRejectBlock redirectReject;
static BOOL modalEnabled;
static BOOL animated;

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(openAuth:(NSString *)authURL
                  redirectURL:(NSString *)redirectURL
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (![self initializeWebBrowserWithResolver:resolve andRejecter:reject]) {
    return;
  }

  BOOL ephemeralWebSession = [options[@"ephemeralWebSession"] boolValue];

  if (@available(iOS 11, *)) {
    NSURL *url = [[NSURL alloc] initWithString:authURL];
    __weak typeof(self) weakSelf = self;
    void (^completionHandler)(NSURL * _Nullable, NSError *_Nullable) = ^(NSURL* _Nullable callbackURL, NSError* _Nullable error) {
      __strong typeof(weakSelf) strongSelf = weakSelf;
      if (strongSelf && redirectResolve) {
        if (!error) {
          NSString *url = callbackURL.absoluteString;
          redirectResolve(@{
            @"type" : @"success",
            @"url" : url,
          });
        } else {
          redirectResolve(@{
            @"type" : @"cancel",
          });
        }
        [strongSelf flowDidFinish];
      }
    };

    NSString *escapedRedirectURL = [[NSURL alloc] initWithString:redirectURL].scheme;

    if (@available(iOS 12.0, *)) {
      webAuthSession = [[ASWebAuthenticationSession alloc]
        initWithURL:url
        callbackURLScheme:escapedRedirectURL
        completionHandler:completionHandler];
    } else {
      authSession = [[SFAuthenticationSession alloc]
        initWithURL:url
        callbackURLScheme:escapedRedirectURL
        completionHandler:completionHandler];
    }

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wpartial-availability"
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
    if (@available(iOS 13.0, *)) {
      if (ephemeralWebSession) {
        //Prevent re-use cookie from last auth session
        webAuthSession.prefersEphemeralWebBrowserSession = true;
      }
      webAuthSession.presentationContextProvider = self;
    }
#endif
#pragma clang diagnostic pop
    if (@available(iOS 12.0, *)) {
      [webAuthSession start];
    } else {
      [authSession start];
    }
  } else {
    resolve(@{
      @"type" : @"cancel",
      @"message" : @"openAuth requires iOS 11 or greater"
    });
    [self flowDidFinish];
  }
}


RCT_EXPORT_METHOD(open:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (![self initializeWebBrowserWithResolver:resolve andRejecter:reject]) {
    return;
  }

  NSString* authURL = [options valueForKey:@"url"];
  NSString* dismissButtonStyle = [options valueForKey:@"dismissButtonStyle"];
  NSNumber* preferredBarTintColor = [options valueForKey:@"preferredBarTintColor"];
  NSNumber* preferredControlTintColor = [options valueForKey:@"preferredControlTintColor"];
  NSString* modalPresentationStyle = [options valueForKey:@"modalPresentationStyle"];
  NSString* modalTransitionStyle = [options valueForKey:@"modalTransitionStyle"];

  BOOL readerMode = [options[@"readerMode"] boolValue];
  BOOL enableBarCollapsing = [options[@"enableBarCollapsing"] boolValue];
  modalEnabled = [options[@"modalEnabled"] boolValue];
  animated = [options[@"animated"] boolValue];

  @try {
    // Safari View Controller to authorize request
    NSURL *url = [[NSURL alloc] initWithString:authURL];
    if (@available(iOS 11.0, *)) {
      SFSafariViewControllerConfiguration *config = [[SFSafariViewControllerConfiguration alloc] init];
      config.barCollapsingEnabled = enableBarCollapsing;
      config.entersReaderIfAvailable = readerMode;
      safariVC = [[SFSafariViewController alloc] initWithURL:url configuration:config];
    } else {
      safariVC = [[SFSafariViewController alloc] initWithURL:url entersReaderIfAvailable:readerMode];
    }
  }
  @catch (NSException *exception) {
    reject(RNInAppBrowserErrorCode, @"Unable to open url.", nil);
    [self flowDidFinish];
    NSLog(@"CRASH: %@", exception);
    NSLog(@"Stack Trace: %@", [exception callStackSymbols]);
    return;
  }
  safariVC.delegate = self;
  if (@available(iOS 11.0, *)) {
    if ([dismissButtonStyle isEqualToString:@"done"]) {
      safariVC.dismissButtonStyle = SFSafariViewControllerDismissButtonStyleDone;
    }
    else if ([dismissButtonStyle isEqualToString:@"close"]) {
      safariVC.dismissButtonStyle = SFSafariViewControllerDismissButtonStyleClose;
    }
    else if ([dismissButtonStyle isEqualToString:@"cancel"]) {
      safariVC.dismissButtonStyle = SFSafariViewControllerDismissButtonStyleCancel;
    }
  }
  if (@available(iOS 10.0, *)) {
    if (preferredBarTintColor) {
      safariVC.preferredBarTintColor = [RCTConvert UIColor:preferredBarTintColor];
    }
    if (preferredControlTintColor) {
      safariVC.preferredControlTintColor = [RCTConvert UIColor:preferredControlTintColor];
    }
  }

  UIViewController *ctrl = RCTPresentedViewController();
  if (modalEnabled) {
    // This is a hack to present the SafariViewController modally
    UINavigationController *safariHackVC = [[UINavigationController alloc] initWithRootViewController:safariVC];
    [safariHackVC setNavigationBarHidden:true animated:false];

    // To disable "Swipe to dismiss" gesture which sometimes causes a bug where `safariViewControllerDidFinish`
    // is not called.
    safariVC.modalPresentationStyle = UIModalPresentationOverFullScreen;
    safariHackVC.modalPresentationStyle = [self getPresentationStyle: modalPresentationStyle];
    if(animated) {
      safariHackVC.modalTransitionStyle = [self getTransitionStyle: modalTransitionStyle];
    }
    safariHackVC.presentationController.delegate = self;
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wpartial-availability"
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
    if (@available(iOS 13.0, *)) {
      [safariHackVC setModalInPresentation:TRUE];
    }
#endif
#pragma clang diagnostic pop
    [ctrl presentViewController:safariHackVC animated:animated completion:nil];
  }
  else {
    [ctrl presentViewController:safariVC animated:animated completion:nil];
  }
}

- (void)performSynchronouslyOnMainThread:(void (^)(void))block
{
  if ([NSThread isMainThread]) {
    block();
  } else {
    dispatch_sync(dispatch_get_main_queue(), block);
  }
}

- (void)_close
{
  __weak typeof(self) weakSelf = self;
  [self performSynchronouslyOnMainThread:^{
      UIViewController *ctrl = RCTPresentedViewController();
      [ctrl dismissViewControllerAnimated:animated completion:^{
        __strong typeof(self) strongSelf = weakSelf;
        if (strongSelf && redirectResolve) {
          redirectResolve(@{
            @"type": @"dismiss",
          });
          [strongSelf flowDidFinish];
        }
      }];
  }];
}

RCT_EXPORT_METHOD(close) {
  [self _close];
}

RCT_EXPORT_METHOD(closeAuth) {
  if (@available(iOS 11, *)) {
    if (redirectResolve) {
      redirectResolve(@{
        @"type": @"dismiss",
      });
      [self flowDidFinish];
    }
    if (@available(iOS 12.0, *)) {
      [webAuthSession cancel];
    } else {
      [authSession cancel];
    }
  } else {
    [self close];
  }
}

RCT_EXPORT_METHOD(isAvailable:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 9.0, *)) {
    // SafariView is available
    resolve(@YES);
  } else {
    resolve(@NO);
  }
}

/**
 * Helper that is used in open and openAuth
 */
- (BOOL)initializeWebBrowserWithResolver:(RCTPromiseResolveBlock)resolve andRejecter:(RCTPromiseRejectBlock)reject {
  if (redirectResolve) {
    reject(RNInAppBrowserErrorCode, @"Another InAppBrowser is already being presented.", nil);
    return NO;
  }
  redirectReject = reject;
  redirectResolve = resolve;

  return YES;
}

/**
 * Called when the user dismisses the SFVC without logging in.
 */
- (void)safariViewControllerDidFinish:(SFSafariViewController *)controller
{
  if (redirectResolve) {
    redirectResolve(@{
      @"type": @"cancel",
    });
  }
  [self flowDidFinish];
  if (!animated) {
    [self dismissWithoutAnimation:controller];
  }
}

-(void)flowDidFinish
{
  safariVC = nil;
  redirectResolve = nil;
  redirectReject = nil;
}

- (UIModalPresentationStyle)getPresentationStyle:(NSString *)styleKey {
  NSDictionary *styles = @{
    @"none": @(UIModalPresentationNone),
    @"fullScreen": @(UIModalPresentationFullScreen),
    @"pageSheet": @(UIModalPresentationPageSheet),
    @"formSheet": @(UIModalPresentationFormSheet),
    @"currentContext": @(UIModalPresentationCurrentContext),
    @"custom": @(UIModalPresentationCustom),
    @"overFullScreen": @(UIModalPresentationOverFullScreen),
    @"overCurrentContext": @(UIModalPresentationOverCurrentContext),
    @"popover": @(UIModalPresentationPopover)
  };
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wpartial-availability"
  UIModalPresentationStyle modalPresentationStyle = UIModalPresentationFullScreen;
#if defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && defined(__IPHONE_13_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_13_0
  if (@available(iOS 13.0, *)) {
    modalPresentationStyle = UIModalPresentationAutomatic;
  }
#endif
#pragma clang diagnostic pop
  NSNumber *style = [styles objectForKey: styleKey];
  if (style != nil) {
    modalPresentationStyle = [style intValue];
  }
  return modalPresentationStyle;
}

- (UIModalTransitionStyle)getTransitionStyle:(NSString *)styleKey {
  NSDictionary *styles = @{
    @"coverVertical": @(UIModalTransitionStyleCoverVertical),
    @"flipHorizontal": @(UIModalTransitionStyleFlipHorizontal),
    @"crossDissolve": @(UIModalTransitionStyleCrossDissolve),
    @"partialCurl": @(UIModalTransitionStylePartialCurl)
  };
  UIModalTransitionStyle modalTransitionStyle = UIModalTransitionStyleCoverVertical;
  NSNumber *style = [styles objectForKey: styleKey];
  if (style != nil) {
    modalTransitionStyle = [style intValue];
  }
  return modalTransitionStyle;
}

- (void)dismissWithoutAnimation:(SFSafariViewController *)controller
{
  CATransition* transition = [CATransition animation];
  transition.duration = 0;
  transition.timingFunction = [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionLinear];
  transition.type = kCATransitionFade;
  transition.subtype = kCATransitionFromBottom;

  controller.view.alpha = 0.05;
  controller.view.frame = CGRectMake(0.0, 0.0, 0.5, 0.5);

  UIViewController *ctrl = RCTPresentedViewController();
  NSString* animationKey = @"dismissInAppBrowser";
  [ctrl.view.layer addAnimation:transition forKey:animationKey];
  [ctrl dismissViewControllerAnimated:NO completion:^{
    [ctrl.view.layer removeAnimationForKey:animationKey];
  }];
}

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wpartial-availability"
- (UIWindow *)presentationAnchorForWebAuthenticationSession:(ASWebAuthenticationSession *)session API_AVAILABLE(ios(13.0))
{
  return UIApplication.sharedApplication.keyWindow;
}
#pragma clang diagnostic pop

@end
