chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    let cookies = await chrome.cookies.getAll({});
    //console.log(cookies);
    sendResponse(cookies);
  })();

  return true;
});
