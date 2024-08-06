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

// A violation of type 3.2: The service worker should not store security-scritical or privacy-sensitive data on the extension storage:
chrome.action.onClicked.addListener(() => { // <== just some random event, triggered by clicking on the extension icon in the extension menu(!)
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
            // Put the sensitive data into the extension storage:
            chrome.storage.local.set({ "pw": event.target.result.pw }).then(() => {
                console.log("Service worker put sensitive data into extension storage.");
            });
        };
    };

    // Return true to indicate that we will respond asynchronously!
    return true;
});
// Note that this is a pretty technical example (sensitive data first being stored safely and then
//   copied to an unsafe location, the extension storage). In practice, an extension would probably
//   simply use the extension storage as the main storage for its sensitive data, something we’d
//   have to check manually; or, possibly, semi-automatically, using some heuristics.
