chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');

    const accountData = [
        { pw: "123456", name: "Alice", age: 42, email: "alice@bob.com" },
        { pw: "correct-battery-horse-staple", name: "Bob", age: 42, email: "bob@alice.com" },
    ];

    console.log('Setting up IndexedDB...');
    // see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#creating_and_structuring_the_store

    const dbName = "account_db";
    const request = indexedDB.open(dbName, 2);

    request.onerror = (event) => {
        console.log("Error: " + event);
    };
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const objectStore = db.createObjectStore("accounts", { keyPath: "name" });

        // Use transaction oncomplete to make sure the objectStore creation is
        // finished before adding data into it.
        objectStore.transaction.oncomplete = (event) => {
            // Store values in the newly created objectStore.
            const accountObjectStore = db
                .transaction("accounts", "readwrite")
                .objectStore("accounts");
            accountData.forEach((account) => {
                accountObjectStore.add(account);
            });
            console.log('IndexedDB has been set up.');
        };
    };
});

// A violation of type 3.1: The service worker should (properly!) authenticate messages coming from the content script:
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.url === "https://www.google.com/") {
        console.log('URL authentication succeeded for ' + sender.url);
    
        // Send back sensitive data to the content script, namely some credentials.
        // To access the sensitive data (we can't just use the extension storage, that would be accesible for the content script anyways),
        //   we need to use an IndexedDB as that one follows the SOP
        //   (see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#security).

        console.log("Retrieving from IndexedDB...");
        // see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#adding_retrieving_and_removing_data
        // and https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#version_changes_while_a_web_app_is_open_in_another_tab

        const openReq = indexedDB.open("account_db", 2);

        openReq.onsuccess = (event) => {
            const db = event.target.result;
            db.transaction("accounts")
              .objectStore("accounts")
              .get("Alice").onsuccess = (event) => {
                console.log("Service worker retrieved password from IndexedDB: " + event.target.result.pw);
                sendResponse(event.target.result.pw);
            };
        };

        // Return true to indicate that we will respond asynchronously!
        return true;
    } else {
        console.log('URL authentication failed for ' + sender.url);
    }
});
