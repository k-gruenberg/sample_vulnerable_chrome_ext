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

Other papers (like ["DoubleX" by Fass et al.](https://github.com/Aurore54F/DoubleX) and ["CoCo" by Yu et al.](https://github.com/CoCoAbstractInterpretation/CoCo)) assume a weaker attacker model of a simple (non-renderer) web attacker:

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

## Non-vulnerable extensions

For comparison (for testing against false positives for your analysis tool), there are also non-vulnerable extensions:
* An extremely simple extension, without any communication or functionality (MV2): `non_vulnerable_mv2`
* An extremely simple extension, without any communication or functionality (MV3): `non_vulnerable_mv3`
* Content script to background page communication (MV2), well-authenticated: `non_vuln01_mv2_well_authenticated`
* Content script to service worker communication (MV3), well-authenticated: `non_vuln01_mv3_well_authenticated`
* Background page (MV2) is storing (non-sensitive) data on the extension storage but not pasting it into other websites at all, leaving no UXSS vector: `non_vuln02_mv2_no_uxss`
* Background page (MV2) is storing (non-sensitive) data on the extension storage and does paste it into other websites, but correctly sanitized, leaving no actual UXSS vector: `non_vuln02_mv2_uxss_safe`
* Service worker (MV3) is storing (non-sensitive) data on the extension storage but not pasting it into other websites at all, leaving no UXSS vector: `non_vuln02_mv3_no_uxss`
* Service worker (MV3) is storing (non-sensitive) data on the extension storage and does paste it into other websites, but correctly sanitized, leaving no actual UXSS vector: `non_vuln02_mv3_uxss_safe`

## '_bg_only' extensions

For some test cases `x` there's also a second variant, named `x_bg_only`, with the only difference that the `content.js` delivered does not provide a hint on the exploitation vector for the vulnerability present.  
This has no effect on the vulnerability itself (as the renderer attacker that we assume can impersonate the content script entirely) but possibly on the ability for detection tools to detect it!  
`_bg_only` varaints do not exist for the weak web attacker model as here the content script is necessary as the confused deputy between web page and service worker/background script.

Note that it is *still* required for the renderer attacker that *any* content script is being injected (at all) for the exploit to work!

## '_cs_only' extensions

Similarly, for some test cases `x` where the background page doesn't actually play an important role, there's also a `x_cs_only` variant.

## Overview vulnerable & non-vulnerable extensions

| Extension                                                        | Vulnerability | Sec. Req. Violation | Attacker model | Authentication | Sanitization | UXSS via | Content Script | Background Page |
| ---------------------------------------------------------------- | ------------- | ------------------- | -------------- | -------------- | ------------ | -------- | -------------- | --------------- |
| non_vulnerable_mv3                                               | none          |                     |                |                |              |          |                |                 |
| ------------------------------------------                       | ------------- | ------------------- | -------------- | -------------- | ------------ | -------- | -------------- | --------------- |
| vuln01_mv3_non_authenticated                                     | type 4.1 [1]  | 3.1 [1]             | renderer       | none           |              |          | yes            | yes             |
| vuln01_mv3_non_authenticated_bg_only                             | type 4.1 [1]  | 3.1 [1]             | renderer       | none           |              |          | no             | yes             |
| vuln01_mv3_ill_authenticated                                     | type 4.1 [1]  | 3.1 [1]             | renderer       | bad            |              |          | yes            | yes             |
| vuln01_mv3_ill_authenticated_bg_only                             | type 4.1 [1]  | 3.1 [1]             | renderer       | bad            |              |          | no             | yes             |
| non_vuln01_mv3_well_authenticated                                | none          |                     |                | sufficient     |              |          | yes            | yes             |
| non_vuln01_mv3_well_authenticated_bg_only                        | none          |                     |                | sufficient     |              |          | no             | yes             |
| ------------------------------------------                       | ------------- | ------------------- | -------------- | -------------- | ------------ | -------- | -------------- | --------------- |
| vuln02_mv3                                                       | ~type 4.2 [1] | 3.2 [1]             | renderer       |                | none         | CS       | yes            | yes             |
| vuln02_mv3_executeScript                                         | type 4.2 [1]  | 3.2 [1]             | renderer       |                | none         | BP       | yes            | yes             |
| vuln02_mv3_cs_only                                               | ~type 4.2 [1] | 3.2 [1]             | renderer       |                | none         | CS       | yes            | no              |
| vuln02_mv3_executeScript_bg_only                                 | type 4.2 [1]  | 3.2 [1]             | renderer       |                | none         | BP       | no             | yes             |
| vuln02_mv3_via_msg_non_authenticated                             | type 4.2 [1]  | 3.1 [1]             | renderer       | none           | none         | BP       | yes            | yes             |
| vuln02_mv3_via_msg_ill_authenticated                             | type 4.2 [1]  | 3.1 [1]             | renderer       | bad            | none         | BP       | yes            | yes             |
| non_vuln02_mv3_no_uxss                                           | none          |                     |                |                | N/A          |          | yes            |                 |
| non_vuln02_mv3_no_uxss_cs_only                                   | none          |                     |                |                | N/A          |          | yes            | no              |
| non_vuln02_mv3_no_uxss_bg_only                                   | none          |                     |                |                | N/A          |          | no             | yes             |
| non_vuln02_mv3_uxss_safe                                         | none          |                     |                |                | correct      |          | yes            | yes             |
| non_vuln02_mv3_uxss_safe_executeScript                           | none          |                     |                |                | correct      |          | yes            | yes             |
| non_vuln02_mv3_uxss_safe_cs_only                                 | none          |                     |                |                | correct      |          | yes            | no              |
| non_vuln02_mv3_uxss_safe_executeScript_bg_only                   | none          |                     |                |                | correct      |          | no             | yes             |
| non_vuln02_mv3_via_msg_well_authenticated                        | none          |                     |                | sufficient     | none         |          | yes            | yes             |
| non_vuln02_mv3_via_msg_no_uxss                                   | none          |                     |                | none           | N/A          |          | yes            | yes             |
| non_vuln02_mv3_via_msg_uxss_safe                                 | none          |                     |                | none           | correct      |          | yes            | yes             |

[1] *Extending a Hand to Attackers: Browser Privilege Escalation Attacks via Extensions* (2023, Young Min Kim and Byoungyoung Lee)

Vulnerabilities/Attacks (see [1]):
* type 4.1: renderer attacker can execute privileged browser APIs (`chrome.cookies.getAll()` in the examples here)
* type 4.2: configurations affecting the background page behavior are modifiable by the content script; through messages or by being stored on the extension storage (here all examples of UXSS)
* type 4.3: sensitive data is accessible to the *read-write* renderer attacker via extension messages or by being stored on the extension storage / to the *read* renderer attacker by being in content script memory

Security Requirements (see [1]):
* 3.1: the background page has to authenticate the sender URL of all messages coming from content scripts
* 3.2: security-critical, privacy-sensitive or cross-site data shall not be stored on the extension storage
* 3.3: security-critical or privacy-sensitive data shall not be stored in content script memory (*read* renderer attacker is sufficient for exploitation here)

Possible combinations (cf. [1], Table 1):

| Attack | Violation of Req. 3.1 | Violation of Req. 3.2 | Violation of Req. 3.3 |
| ------ | --------------------- | --------------------- | --------------------- |
| 4.1    | X                     |                       |                       |
| 4.2    | X                     | X                     |                       |
| 4.3    | X                     | X                     | X                     |
