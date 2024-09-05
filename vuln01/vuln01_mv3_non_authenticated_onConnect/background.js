chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});


chrome.runtime.onConnect.addListener((port => {
    chrome.cookies.getAll({},
        function(cookies) {
            port.postMessage(cookies);
        }
    );
}));
