chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Below you'll find the same code as for "vuln01_mv3_non_authenticated", the difference for this example lies not here in background.js but
//   rather in content.js, which (unlike in "vuln01_mv3_non_authenticated") now acts as an (involuntary) proxy for the pure(!!!) web attacker:

// Vulnerable extension's background page (cf. 2023 paper by Young Min Kim and Byoungyoung Lee, Listing 1):
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // (PART(!) OF THE) VULNERABILITY LIES HERE: Does not authenticate the URL (sender.url) at all
  //   => requesting content script is relaying a malicious "request" that it got from a malicious website via a DOM event(!)
  chrome.cookies.getAll({}, // <= privileged API; see also: https://developer.chrome.com/docs/extensions/reference/api/cookies
    function(cookies) {
      //console.log(cookies);
      sendResponse(cookies);
    }
  );

  // Return true to indicate that we will respond asynchronously!
  return true;
});
