chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

function getCookies(sendResponse) {
    chrome.cookies.getAll({},
        function(cookies) {
            sendResponse(cookies);
        }
    );
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    getCookies(sendResponse);
    return true;
});
