chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  chrome.cookies.getAll({}).then( // => use Promise instead of callback
    (cookies) => {
      //console.log(cookies);
      sendResponse(cookies);
    }
  );

  // Return true to indicate that we will respond asynchronously!
  return true;
});
