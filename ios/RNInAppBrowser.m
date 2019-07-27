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

@interface RNInAppBrowser () <SFSafariViewControllerDelegate>

@property (nonatomic, copy) RCTPromiseResolveBlock redirectResolve;
@property (nonatomic, copy) RCTPromiseRejectBlock redirectReject;

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wpartial-availability"
#if __IPHONE_OS_VERSION_MIN_REQUIRED >= __IPHONE_12_0
@property (nonatomic, strong) ASWebAuthenticationSession *authSession;
#else
@property (nonatomic, strong) SFAuthenticationSession *authSession;
#endif
#pragma clang diagnostic pop

@end

NSString *RNInAppBrowserErrorCode = @"RNInAppBrowser";

@implementation RNInAppBrowser
{
  BOOL animated;
}

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}


RCT_EXPORT_METHOD(openAuth:(NSString *)authURL
                  redirectURL:(NSString *)redirectURL
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self initializeWebBrowserWithResolver:resolve andRejecter:reject];

  if (@available(iOS 11, *)) {
    NSURL *url = [[NSURL alloc] initWithString: authURL];
    __weak typeof(self) weakSelf = self;
    void (^completionHandler)(NSURL * _Nullable, NSError *_Nullable) = ^(NSURL* _Nullable callbackURL, NSError* _Nullable error) {
      __strong typeof(weakSelf) strongSelf = weakSelf;
      if (strongSelf) {
        if (!error) {
          NSString *url = callbackURL.absoluteString;
          strongSelf->_redirectResolve(@{
                                         @"type" : @"success",
                                         @"url" : url,
                                         });
        } else {
          strongSelf->_redirectResolve(@{
                                         @"type" : @"cancel",
                                         });
        }
        [strongSelf flowDidFinish];
      }
    };
#if __IPHONE_OS_VERSION_MIN_REQUIRED >= __IPHONE_12_0
    _authSession = [[ASWebAuthenticationSession alloc]
                      initWithURL:url
                      callbackURLScheme:redirectURL
                      completionHandler:completionHandler];
#else
    _authSession = [[SFAuthenticationSession alloc]
                      initWithURL:url
                      callbackURLScheme:redirectURL
                      completionHandler:completionHandler];
#endif
    [_authSession start];
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
  BOOL readerMode = [options[@"readerMode"] boolValue];
  NSString* modalPresentationStyle = [options valueForKey:@"modalPresentationStyle"];
  NSString* modalTransitionStyle = [options valueForKey:@"modalTransitionStyle"];
  BOOL modalEnabled = [options[@"modalEnabled"] boolValue];
  animated = [options[@"animated"] boolValue];

  // Safari View Controller to authorize request
  NSURL *url = [[NSURL alloc] initWithString:authURL];
  SFSafariViewController *safariVC = [[SFSafariViewController alloc] initWithURL:url entersReaderIfAvailable:readerMode];
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
    safariVC.modalPresentationStyle = [self getPresentationStyle: modalPresentationStyle];
    if(animated) {
      safariVC.modalTransitionStyle = [self getTransitionStyle: modalTransitionStyle];
    }

    // This is a hack to present the SafariViewController modally
    UINavigationController *safariHackVC = [[UINavigationController alloc] initWithRootViewController:safariVC];
    [safariHackVC setNavigationBarHidden:true animated:false];
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
  __weak typeof(BOOL) weakAnimated = animated;
  [self performSynchronouslyOnMainThread:^{
    UIViewController *ctrl = RCTPresentedViewController();
    [ctrl dismissViewControllerAnimated:weakAnimated completion:^{
      __strong typeof(self) strongSelf = weakSelf;
      if (strongSelf && strongSelf.redirectResolve) {
        strongSelf.redirectResolve(@{
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
    [_authSession cancel];
    if (_redirectResolve) {
      _redirectResolve(@{
        @"type": @"dismiss",
      });

      [self flowDidFinish];
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
  if (_redirectResolve) {
    reject(RNInAppBrowserErrorCode, @"Another InAppBrowser is already being presented.", nil);
    return NO;
  }
  _redirectReject = reject;
  _redirectResolve = resolve;

  return YES;
}

/**
 * Called when the user dismisses the SFVC without logging in.
 */
- (void)safariViewControllerDidFinish:(SFSafariViewController *)controller
{
  if (!animated) {
    [self dismissWithoutAnimation:controller];
  }
  _redirectResolve(@{
    @"type": @"cancel",
  });
  [self flowDidFinish];
}

-(void)flowDidFinish
{
  _redirectResolve = nil;
  _redirectReject = nil;
}

- (UIModalPresentationStyle)getPresentationStyle:(NSString *)styleKey {
  NSDictionary *styles = @{
    @"fullScreen": @(UIModalPresentationFullScreen),
    @"pageSheet": @(UIModalPresentationPageSheet),
    @"formSheet": @(UIModalPresentationFormSheet),
    @"currentContext": @(UIModalPresentationCurrentContext),
    @"custom": @(UIModalPresentationCustom),
    @"overFullScreen": @(UIModalPresentationOverFullScreen),
    @"overCurrentContext": @(UIModalPresentationOverCurrentContext),
    @"popover": @(UIModalPresentationPopover),
    @"none": @(UIModalPresentationNone)
  };
  UIModalPresentationStyle modalPresentationStyle = UIModalPresentationOverFullScreen;
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
  transition.duration = 0.0;
  transition.timingFunction = [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseInEaseOut];
  transition.type = kCATransitionFade;
  transition.subtype = kCATransitionFromBottom;

  controller.view.alpha = 0.05;
  controller.view.frame = CGRectMake(0.0, 0.0, 0.5, 0.5);

  UIViewController *ctrl = RCTPresentedViewController();
  NSString* animationKey = @"dismissInAppBrowser";
  [ctrl.view.layer addAnimation:transition forKey:animationKey];
  [ctrl dismissViewControllerAnimated:false completion:^{
    [ctrl.view.layer removeAnimationForKey:animationKey];
  }];
}

@end
