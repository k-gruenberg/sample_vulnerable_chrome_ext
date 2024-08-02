chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.url === "https://www.google.com/") {
    console.log('URL authentication succeeded for ' + sender.url);
    chrome.cookies.getAll({}, // <= privileged API; see also: https://developer.chrome.com/docs/extensions/reference/api/cookies
      function(cookies) {
        //console.log(cookies);
        sendResponse(cookies);
      }
    );

    // Return true to indicate that we will respond asynchronously!
    return true;
  } else {
    console.log('URL authentication failed for ' + sender.url);
  }
});
