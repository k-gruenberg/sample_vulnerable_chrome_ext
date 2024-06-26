# sample_vulnerable_chrome_ext
Some sample vulnerable Chrome extensions (under different attacker models: simple web attacker &amp; advanced renderer attacker and under different manifest versions: MV2 &amp; MV3).  
Vulnerabilities considered here are those considered by Young Min Kim and Byoungyoung Lee in their 2023 paper *Extending a Hand to Attackers: Browser Privilege Escalation Attacks via Extensions*.

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
  * Sensitive data received through messages from the background page (MV2 extension): `vuln03_mv2_bg_page`
  * Sensitive data received through messages from the service worker (MV3 extension): `vuln03_mv3_service_worker`
