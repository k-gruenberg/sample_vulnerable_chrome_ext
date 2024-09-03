chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

function msg_handler(msg, sender, sendResponse) {
    chrome.cookies.getAll({},
        function(cookies) {
            sendResponse(cookies);
        }
    );
    return true;
}
        
chrome.runtime.onMessage.addListener(msg_handler);
