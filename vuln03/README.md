# /vuln03: Type 03 vulnerabilities
This folder contains all sample Chrome extensions exhibiting a vulnerability of type 4.3 [1] (sensitive data being accessible to an attacker)
by violating any of the security requirements 3.1, 3.2 or 3.3 [1]:
1. Security violation 3.1: Sensitive data is accessible via (non-/ill-authenticated) extension messages. 
2. Security violation 3.2: Sensitive data is stored on the extension storage.
3. Security violation 3.3: Sensitive data is stored inside content script memory.

Note that while the first two require a *read-write* renderer attacker,
a *read(-only)* renderer attacker, i.e., a simple side-channel attack, is sufficient for the third attack! (cf. [1])

## Overview vulnerable & non-vulnerable extensions (under the renderer attacker model)

Under the renderer attacker model, the attacker either has read (from a side-channel attack) or read and write (e.g., from a buffer overflow) capabilities
for the renderer process. Thereby, the attacker can do whatever the content script is capable of doing, or at least read its memory.
This is under the assumption that there *is* an injected content script (otherwise there would be no vulnerability, unless there is *yet another*
vulnerability like CVE-2022-32784 [1]).

For type 4.3 [1] vulnerabilites, the attacker is able to read sensitive data (some credentials in our examples):

| Extension                                                            | Vulnerability | Sec. Req. Violation | Attacker model  | Authentication | Sanitization | Content Script | Background Page | Offscreen document | Storage used by offscreen document |
| -------------------------------------------------------------------- | ------------- | ------------------- | --------------- | -------------- | ------------ | -------------- | --------------- | ------------------ | ---------------------------------- |
| vuln03_mv3_credentials_accessible_via_ext_msg_non_authenticated      | type 4.3 [1]  | 3.1 [1]             | renderer        | none           | N/A          | yes            | yes             | yes                | localStorage                       |
| vuln03_mv3_credentials_accessible_via_ext_msg_ill_authenticated      | type 4.3 [1]  | 3.1 [1]             | renderer        | bad            | N/A          | yes            | yes             | yes                | localStorage                       |
| vuln03_mv3_credentials_stored_on_ext_storage                         | type 4.3 [1]  | 3.2 [1]             | renderer        |                | N/A          | yes            | yes             | yes                | localStorage                       |
| vuln03_mv3_credentials_in_cs_memory                                  | type 4.3 [1]  | 3.3 [1]             | renderer (read) |                | N/A          | yes            | yes             | yes                | localStorage                       |
| non_vuln03_mv3_credentials_accessible_via_ext_msg_well_authenticated | none          |                     |                 | sufficient     | N/A          | yes            | yes             | yes                | localStorage                       |

[1] *Extending a Hand to Attackers: Browser Privilege Escalation Attacks via Extensions* (2023, Young Min Kim and Byoungyoung Lee)

Vulnerabilities/Attacks (see [1]):
* type 4.3: sensitive data is accessible to the *read-write* renderer attacker via extension messages or by being stored on the extension storage / to the *read* renderer attacker by being in content script memory

Security Requirements (see [1]):
* 3.1: the background page has to authenticate the sender URL of all messages coming from content scripts
* 3.2: security-critical, privacy-sensitive or cross-site data shall not be stored on the extension storage
* 3.3: security-critical or privacy-sensitive data shall not be stored in content script memory (*read* renderer attacker is sufficient for exploitation here)
