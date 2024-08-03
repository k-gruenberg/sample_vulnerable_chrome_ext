# /vuln02: Type 02 vulnerabilities
This folder contains all sample Chrome extensions exhibiting a vulnerability of type 4.2 [1] by violating either security requirement 3.1 or 3.2 [1];
as well as sample extensions which are actually *not* vulnerable due to...
* ...the service worker (background page) correctly authenticating the message (security requirement 3.1): `non_vuln02_mv3_via_msg_well_authenticated`
* ...there being no UXSS vulnerability because of correct sanitization: `uxss_safe`
* ...there being no UXSS attack vector at all (included for completeness, security requirement 3.2): `no_uxss`

Note that while vulnerability type 4.2 broadly refers to any configuration affecting the behavior of the service worker (background page) being
modifiable by the content script (either through non-authenticated messages (3.1 violation) or through the extension storage (3.2 violation)),
only **UXSS** vulnerabilities are considered here, i.e., cases where the service worker (background page) is pasting data into other web pages 
without (proper) sanitization.

Also, although technically in [1] attack type 4.2 requires the behavior of to background page to be affected, this list includes also vulnerable
extensions where the *content script* is the component pasting data from the extension storage unsanitized into a web site, creating the UXSS attack vector:
* `vuln02_mv3`
* `vuln02_mv3_cs_only`

The following extensions are the corresponding *non-vulnerable* ones:
* `non_vuln02_mv3_no_uxss_cs_only`
* `non_vuln02_mv3_uxss_safe_cs_only`
* `non_vuln02_mv3_uxss_safe`

## Overview vulnerable & non-vulnerable extensions (under the renderer attacker model)

Under the renderer attacker model, a malicious website uses a vulnerability (e.g., a buffer overflow) in Chrome's rendering engine to gain control of the
renderer process. Thereby, the attacker can do whatever the content script is capable of doing; assuming that there *is* an injected content script
(otherwise there would be no vulnerability, unless there is *yet another* vulnerability like CVE-2022-32784 [1]). This includes accessing the extension
storage. When the background page or the content script of another website now pastes content from the extension storage into another website, a UXSS vector
is created.

For type 4.2 [1] vulnerabilites, the attacker is able to perform a UXSS (Universal Cross-Site Scripting) attack:

| Extension                                                        | Vulnerability | Sec. Req. Violation | Attacker model | Authentication | Sanitization | UXSS via | Content Script | Background Page |
| ---------------------------------------------------------------- | ------------- | ------------------- | -------------- | -------------- | ------------ | -------- | -------------- | --------------- |
| vuln02_mv3                                                       | ~type 4.2 [1] | 3.2 [1]             | renderer       |                | none         | CS       | yes            | yes             |
| vuln02_mv3_executeScript                                         | type 4.2 [1]  | 3.2 [1]             | renderer       |                | none         | BP       | yes            | yes             |
| vuln02_mv3_cs_only                                               | ~type 4.2 [1] | 3.2 [1]             | renderer       |                | none         | CS       | yes            | no              |
| vuln02_mv3_executeScript_bg_only                                 | type 4.2 [1]  | 3.2 [1]             | renderer       |                | none         | BP       | no             | yes             |
| vuln02_mv3_via_msg_non_authenticated                             | type 4.2 [1]  | 3.1 [1]             | renderer       | none           | none         | BP       | yes            | yes             |
| vuln02_mv3_via_msg_ill_authenticated                             | type 4.2 [1]  | 3.1 [1]             | renderer       | bad            | none         | BP       | yes            | yes             |
| non_vuln02_mv3_no_uxss                                           | none          |                     |                |                | N/A          |          | yes            | yes             |
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
* type 4.2: configurations affecting the background page behavior are modifiable by the content script; through messages or by being stored on the extension storage (here all examples of UXSS)

Security Requirements (see [1]):
* 3.1: the background page has to authenticate the sender URL of all messages coming from content scripts
* 3.2: security-critical, privacy-sensitive or cross-site data shall not be stored on the extension storage

## Overview vulnerable extensions (under the web attacker model)

Under the web attacker model, it is required that the malicious web page has indirect writing access to the extension storage via communication with
the content script (or the background page/service worker). If the background page/service (or content script) worker then pastes this data into different
websites, unfiltered, we got UXSS:

| Extension                                                        | Web page -> CS comm.  | Web page <- CS comm. | Attacker model | Authentication | Sanitization | DoubleX  | CoCo |
| ---------------------------------------------------------------- | --------------------- | -------------------- | -------------- | -------------- | ------------ | -------- | ---- |
| vuln02_weak_mv3_runtime_sendMessage_ext_storage                  | (none)                | (none)               | web            | none           | none         | ToDo     | ToDo |
| vuln02_weak_mv3_postMessage_ext_storage                          | postMessage           | postMessage          | web            | none           | none         | ToDo     | ToDo |
| vuln02_weak_mv3_dom_ext_storage                                  | DOM                   | DOM                  | web            | none           | none         | ToDo     | ToDo |
| vuln02_weak_mv3_localStorage_ext_storage                         | localStorage          | localStorage         | web            | none           | none         | ToDo     | ToDo |


## Notes on UXSS

Note that, despite our assumptions, neither do all 4.2 vulnerabilities have to be UXSS vulnerabilities nor are all UXSS vulnerabilities 4.2 vulnerabilities:
* Type 4.1 vulnerabilities can also result in UXSS when the privileged browser API is `executeScript`;
  the difference to `vuln02_mv3_via_msg` being that an API is called directly, instead of a config being changed
  (for the other cases listed here, there's the added difference that the extension storage is involved, see security requirement 3.2).
* Type 4.2 vulnerabilites do not have to be UXSS vulnerabilites. The service worker/background page behavior could be dangerously affected by content script actions in other ways as well.
