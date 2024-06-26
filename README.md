# sample_vulnerable_chrome_ext
Some sample vulnerable Chrome extensions (under different attacker models: advanced renderer attacker &amp; simple web attacker and under different manifest versions: MV2 &amp; MV3).

```
[Web Page] <-----postMessage/DOM/localStorage-----> [Content Script] <-----messages/extension storage-----> [Background Page (MV2) / Service Worker (MV3)] -----can insert stuff into-----> [Other Web Pages]
  |                                                                                                                      /|\
  -----------------------------------------------runtime.sendMessage()-----------------------------------------------------
```

`Web Page` and `Content Script` lie in the same process (the renderer process), while the `Background Page` lies in a seperate process (the extension process).

While a **simple web attacker** can only influence the background page through the arrows shown between web page and content script and web page and background page,  
a more powerful **renderer attacker** can take over the content script as well and influence the background page through the arrow shown between content script and background page.

## Renderer attacker

Vulnerabilities considered here are those considered by Young Min Kim and Byoungyoung Lee in their 2023 paper *Extending a Hand to Attackers: Browser Privilege Escalation Attacks via Extensions*:

* *Vulnerability type 01:* **Content script** has access to privileged API by sending an extension message to the **background page/service worker** that is either not authenticated at all, or ill-authenticated:
  * Content script to background page (MV2), non-authenticated: `vuln01_mv2_non_authenticated`
  * Content script to background page (MV2), ill-authenticated: `vuln01_mv2_ill_authenticated`
  * Content script to service worker (MV3), non-authenticated: `vuln01_mv3_non_authenticated`
  * Content script to service worker (MV3), ill-authenticated: `vuln01_mv3_ill_authenticated`

* *Vulnerability type 02:* The **background page/service worker** is storing data on the **extension storage** which it then pastes to different websites, unfiltered, resulting in UXSS:
  * Background page (MV2) and extension storage: `vuln02_mv2`
  * Service worker (MV3) and extension storage: `vuln02_mv3`
 
* *Vulnerability type 03:* The **content script** has access to *sensitive* data, either through extension messages exchanged with the **background script/service worker** or through the **extension storage**:
  * Sensitive data in extension storage (MV2 extension): `vuln03_mv2_ext_storage`
  * Sensitive data in extension storage (MV3 extension): `vuln03_mv3_ext_storage`
  * Sensitive data received through non-authenticated messages from the background page (MV2 extension): `vuln03_mv2_non_authenticated`
  * Sensitive data received through ill-authenticated messages from the background page (MV2 extension): `vuln03_mv2_ill_authenticated`
  * Sensitive data received through non-authenticated messages from the service worker (MV3 extension): `vuln03_mv3_non_authenticated`
  * Sensitive data received through ill-authenticated messages from the service worker (MV3 extension): `vuln03_mv3_ill_authenticated`

## Simple web attacker

Other papers (like "DoubleX" by Fass et al. and "CoCo" by Yu et al.) assume a weaker attacker model of a simple (non-renderer) web attacker:

* *Vulnerabilities exploitable under a weaker attacker model, namely by simple (non-renderer) web attackers:* **Web page** can interact with the **content script** through postMessages, the DOM and localStorage; as well as the **background page/service worker** through runtime.sendMessage() (but only *if* the web page's URL is specified under the "externally_connectable" key in the extension's manifest.json!):
  * The web page has access to a privileged API through runtime.sendMessage(), i.e. through direct communication with the background page (MV2): `vuln01_weak_mv2_runtime_sendMessage`
  * The web page has access to a privileged API through runtime.sendMessage(), i.e. through direct communication with the service worker (MV3): `vuln01_weak_mv3_runtime_sendMessage`
  * The web page has access to a privileged API indirectly through communication with the content script via postMessage, which in turn communicates with the background page (MV2): `vuln01_weak_mv2_postMessage`
  * The web page has access to a privileged API indirectly through communication with the content script via the DOM, which in turn communicates with the background page (MV2): `vuln01_weak_mv2_dom`
  * The web page has access to a privileged API indirectly through communication with the content script via localStorage, which in turn communicates with the background page (MV2):  `vuln01_weak_mv2_localStorage`
  * The web page has access to a privileged API indirectly through communication with the content script via postMessage, which in turn communicates with the service worker (MV3): `vuln01_weak_mv3_postMessage`
  * The web page has access to a privileged API indirectly through communication with the content script via the DOM, which in turn communicates with the service worker (MV3): `vuln01_weak_mv3_dom`
  * The web page has access to a privileged API indirectly through communication with the content script via localStorage, which in turn communicates with the service worker (MV3): `vuln01_weak_mv3_localStorage`
  * Similarly, the web page has access to sensitive data:
     * `vuln03_weak_mv2_runtime_sendMessage`
     * `vuln03_weak_mv3_runtime_sendMessage`
     * `vuln03_weak_mv2_postMessage`
     * `vuln03_weak_mv2_dom`
     * `vuln03_weak_mv2_localStorage`
     * `vuln03_weak_mv3_postMessage`
     * `vuln03_weak_mv3_dom`
     * `vuln03_weak_mv3_localStorage`
     * It is also conceivable that the web page has indirect reading access to the extension storage via communication with the content script (or the background page/service worker):
     * `vuln03_weak_mv2_runtime_sendMessage_ext_storage`
     * `vuln03_weak_mv3_runtime_sendMessage_ext_storage`
     * `vuln03_weak_mv2_postMessage_ext_storage`
     * `vuln03_weak_mv2_dom_ext_storage`
     * `vuln03_weak_mv2_localStorage_ext_storage`
     * `vuln03_weak_mv3_postMessage_ext_storage`
     * `vuln03_weak_mv3_dom_ext_storage`
     * `vuln03_weak_mv3_localStorage_ext_storage`
  * It is also theoretically conceivable that the web page has indirect writing access to the extension storage via communication with the content script (or the background page/service worker). If the background page/service worker then pastes this data into different websites, unfiltered, we got UXSS:
     * `vuln02_weak_mv2_runtime_sendMessage_ext_storage`
     * `vuln02_weak_mv3_runtime_sendMessage_ext_storage`
     * `vuln02_weak_mv2_postMessage_ext_storage`
     * `vuln02_weak_mv2_dom_ext_storage`
     * `vuln02_weak_mv2_localStorage_ext_storage`
     * `vuln02_weak_mv3_postMessage_ext_storage`
     * `vuln02_weak_mv3_dom_ext_storage`
     * `vuln02_weak_mv3_localStorage_ext_storage`

Note that, for simplicity, we're always assuming non-authentication (instead of ill-authentication) for all of the examples above.

