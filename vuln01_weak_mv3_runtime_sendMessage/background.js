chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Vulnerable extension's background page:
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => { // cf. https://developer.chrome.com/docs/extensions/develop/concepts/messaging#external-webpage
  // VULNERABILITY LIES HERE: Does not authenticate the URL (sender.url) at all
  //   => requesting web site may be a malicious site
  //      (and we're allowing messages to come from *any* web site, cf. "externally_connectable" field being set to "<all_urls>" in manifest.json)
  //   => this vulnerability assumes a simple web attacker, no renderer attacker is needed here!
  chrome.cookies.getAll({}, // <= privileged API; see also: https://developer.chrome.com/docs/extensions/reference/api/cookies
    function(cookies) {
      //console.log(cookies);
      sendResponse(cookies);
    }
  );

  // Return true to indicate that we will respond asynchronously!
  return true;
});
