chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

function msg_handler(msg, sender, sendResponse) {
    function cookies_handler(cookies) {
        sendResponse(cookies);
    }

    chrome.cookies.getAll({}, cookies_handler);
    return true;
}

chrome.runtime.onMessage.addListener(msg_handler);
