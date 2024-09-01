chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Vulnerable extension's background page (cf. 2023 paper by Young Min Kim and Byoungyoung Lee, Listing 1):
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // VULNERABILITY LIES HERE: Does not authenticate the URL (sender.url) at all
  //   => requesting "content script" may be from a malicious site that used a vulnerability in Chrome's rendering engine to escalate its privileges!
  //   => under the assumption of a regular (non-renderer) web attacker, this is not(!) a vulnerability as the service worker cannot receive
  //      any messages from websites if the "externally_connectable" key isn't specified in the manifest.json (which it isn't in this case,
  //      and, besides, "chrome.runtime.onMessageExternal.addListener()" would have to be used instead, too)!

  chrome.cookies.get({ // <= privileged API; see also: https://developer.chrome.com/docs/extensions/reference/api/cookies
    url: "https://www.google.com/",
    name: "AEC",
  }, (cookie) => {
      if (cookie) {
        console.log("Cookie found:");
        console.log(cookie);
        sendResponse(cookie);
      } else {
        console.log("Cookie not found.");
      }
    }
  );

  // Return true to indicate that we will respond asynchronously!
  return true;
});
