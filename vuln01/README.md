# /vuln01: Type 01 vulnerabilities
This folder contains all sample Chrome extensions exhibiting a vulnerability of type 4.1 [1] by violating security requirement 3.1 [1];
as well as 2 sample extensions which are actually *not* vulnerable due to the service worker (background page) correctly authenticating the message.

## Overview vulnerable & non-vulnerable extensions (under the renderer attacker model)

Under the renderer attacker model, a malicious website used a vulnerability (e.g., a buffer overflow) in Chrome's rendering engine to gain control of the
renderer process. Thereby, the attacker can do whatever the content script is capable of doing; assuming that there *is* an injected content script
(otherwise there would be no vulnerability, unless there is *yet another* vulnerability like CVE-2022-32784 [1]).

For type 4.1 [1] vulnerabilites, the attacker is able to execute a privileged browser API (in the examples here it's `chrome.cookies.getAll()`) by sending
messages to the service worker (background page), disguised as the content script, without the service worker (background page) *properly* verifying the
sender URL of the message:

| Extension                                                        | Vulnerability | Sec. Req. Violation | Attacker model | Authentication | Sanitization | Content Script | Background Page |
| ---------------------------------------------------------------- | ------------- | ------------------- | -------------- | -------------- | ------------ | -------------- | --------------- |
| vuln01_mv3_non_authenticated                                     | type 4.1 [1]  | 3.1 [1]             | renderer       | none           | N/A          | yes            | yes             |
| vuln01_mv3_non_authenticated_bg_only                             | type 4.1 [1]  | 3.1 [1]             | renderer       | none           | N/A          | no             | yes             |
| vuln01_mv3_ill_authenticated                                     | type 4.1 [1]  | 3.1 [1]             | renderer       | bad            | N/A          | yes            | yes             |
| vuln01_mv3_ill_authenticated_bg_only                             | type 4.1 [1]  | 3.1 [1]             | renderer       | bad            | N/A          | no             | yes             |
| non_vuln01_mv3_well_authenticated                                | none          |                     |                | sufficient     | N/A          | yes            | yes             |
| non_vuln01_mv3_well_authenticated_bg_only                        | none          |                     |                | sufficient     | N/A          | no             | yes             |

[1] *Extending a Hand to Attackers: Browser Privilege Escalation Attacks via Extensions* (2023, Young Min Kim and Byoungyoung Lee)

Vulnerabilities/Attacks (see [1]):
* type 4.1: renderer attacker can execute privileged browser APIs (`chrome.cookies.getAll()` in the examples here)

Security Requirements (see [1]):
* 3.1: the background page has to authenticate the sender URL of all messages coming from content scripts

## Overview vulnerable extensions (under the web attacker model)

Under the web attacker model, a malicious website either (a) has to abuse the content script as a confused deputy to communicate with the service worker
(background page), or (b) has to communicate with the service worker (background page) directly using the `chrome.runtime.onMessageExternal` API.
Note that the latter requires the URL of the malicious site to be included within `externally_connectable` in the `manifest.json` file.

We assume the same kind of vulnerability, namely access to a privileged browser API (`chrome.cookies.getAll()` in the examples here).

For these kinds of vulnerabilities, there are existing analysis tools to detect them, e.g., ["DoubleX" by Fass et al.](https://github.com/Aurore54F/DoubleX)
or ["CoCo" by Yu et al.](https://github.com/CoCoAbstractInterpretation/CoCo):

| Extension                                                        | Web page -> CS comm.  | Web page <- CS comm. | Attacker model | Authentication | Sanitization | DoubleX  | CoCo |
| ---------------------------------------------------------------- | --------------------- | -------------------- | -------------- | -------------- | ------------ | -------- | ---- |
| vuln01_weak_mv3_dom                                              | DOM                   | DOM                  | web            | none           | N/A          | -        | -    |
| vuln01_weak_mv3_dom_and_postMessage                              | DOM                   | postMessage          | web            | none           | N/A          | X        | -    |
| vuln01_weak_mv3_localStorage                                     | localStorage          | localStorage         | web            | none           | N/A          | -        | -    |
| vuln01_weak_mv3_postMessage                                      | postMessage           | postMessage          | web            | none           | N/A          | X        | X    |
| vuln01_weak_mv3_postMessage_and_dom                              | postMessage           | DOM                  | web            | none           | N/A          | -        | -    |
| vuln01_weak_mv3_runtime_sendMessage                              | (none)                | (none)               | web            | none           | N/A          | X        | X    |
| vuln01_weak_mv3_runtime_sendMessage_dynamic_function_call1       | (none)                | (none)               | web            | none           | N/A          | -        | -    |
| vuln01_weak_mv3_runtime_sendMessage_dynamic_function_call2       | (none)                | (none)               | web            | none           | N/A          | -        | X    |
| vuln01_weak_mv3_runtime_sendMessage_dynamic_function_call3       | (none)                | (none)               | web            | none           | N/A          | -        | X    |
