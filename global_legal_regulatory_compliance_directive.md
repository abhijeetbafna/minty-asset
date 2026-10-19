# Global Legal & Regulatory Software Compliance Directive

This document defines mandatory implementation rules for software code, database structures, security configurations, and data architecture to ensure global regulatory compliance across key jurisdictions and standards (including GDPR, CCPA/CPRA, HIPAA, PCI DSS 4.0, India DPDP, EU NIS2/DORA, ISO 27001, WCAG, COPPA, and Apple/Google App Store mandates).

---

## 1. Global Data Privacy & Subject Rights

### 1.1 Consent Management & Lawful Processing
* **Explicit Opt-In:** Default all non-essential data collection, tracking scripts, and marketing toggles to `false`. Requiring pre-ticked consent boxes is strictly prohibited.
* **Granular Consent:** Store consent granularly (e.g., separating functional analytics from marketing cookies) with UTC timestamps, user/session IDs, and policy version strings.
* **Easy Revocation:** Implement self-serve mechanism endpoints for users to withdraw consent or change preferences at any time.

### 1.2 Data Subject Access Rights (DSAR)
* **Right to Rectification & Export (Data Portability):** Build export endpoints that package all personal data associated with a user identifier into structured, machine-readable JSON/CSV formats upon request.
* **Right to be Forgotten (Data Erasure):** Implement hard-deletion cascades or irreversible anonymization routines for user personal identifiable information (PII) upon request.
* **Audit Trail Retention:** Retain only immutable, pseudonymized audit records of deletion requests to demonstrate compliance without storing user PII.

### 1.3 Data Minimization & Retention Limits
* **Fields-On-Demand:** Limit payload schemas exclusively to data required for current execution context. Never collect or log superfluous user attributes.
* **Automated Data Lifecycle (TTL):** Enforce time-to-live (TTL) expiration policies or scheduled background purging jobs for ephemeral data (e.g., login tokens, abandoned carts, temporary upload buckets).

---

## 2. Mobile App Store & Web Platform Rules

### 2.1 Native In-App Account Deletion
* **In-App & Web Deletion Flow:** If an application allows account creation, it must provide a clear, direct in-app mechanism to delete the account and associated data without forcing users to call support or send manual emails.
* **Subscription State Syncing:** Explicitly notify users during account deletion if active third-party store subscriptions (Apple App Store / Google Play) must be manually canceled via store settings.

### 2.2 Permissions, Tracking & SDK Governance
* **App Tracking Transparency (ATT) & Privacy Sandbox:** Never access device advertising IDs (`IDFA`, `GAID`) or initiate tracking across third-party properties without explicit runtime user permission.
* **Zero Fingerprinting:** Strictly prohibit collecting fallback device attributes (e.g., battery level, installed fonts, canvas rendering signatures, network connection states) to build persistent device fingerprints.
* **Minimal Permission Requests:** Request native platform permissions (Camera, Location, Contacts, Bluetooth) strictly in-context when a feature is used, accompanied by human-readable justification strings.

### 2.3 User-Generated Content (UGC) & Safety
* **Content Moderation & Reporting:** Every app allowing user-generated content (text, image, audio, video) must include:
  * In-app mechanisms to report objectionable content and abusive users.
  * In-app controls to block abusive users immediately.
  * Automated or human content moderation filtering before public feed distribution.

---

## 3. PII, Protected Health Information (PHI) & Financial Data

### 3.1 Encryption Standards
* **Data at Rest:** Encrypt all databases, object stores, and local backups containing PII/PHI using AES-256 or ChaCha20-Poly1305.
* **Data in Transit:** Enforce TLS 1.3 (or strictly TLS 1.2 with secure cipher suites) for all external network endpoints and internal service-to-service communications (mTLS).
* **Column-Level Field Encryption:** Apply application-level envelope encryption to sensitive fields (e.g., SSN/Tax IDs, health records, banking details) using separate cryptographic keys managed by a Key Management Service (KMS).

### 3.2 Payment Card Industry Compliance (PCI DSS 4.0) & App Monetization
* **Zero Primary Account Number (PAN) Storage:** Never store raw credit card numbers, CVVs/CVCs, or PINs in application databases or logs. Use tokenized payment solutions (e.g., Stripe, Adyen).
* **IAP & Alternative Billing Compliance:** Route digital purchases through official App Store / Google Play Billing unless granted specific regional regulatory exemptions (e.g., EU Digital Markets Act). Provide transparent disclosures prior to redirecting users to external payment gateways.
* **Masking & Truncation:** Display no more than the first 6 and last 4 digits of a card number on user-facing interfaces or reports.

### 3.3 Health Data Protection (HIPAA / Health Regulations)
* **ePHI Segregation:** Isolate Electronic Protected Health Information (ePHI) within segregated database schemas or encrypted stores.
* **Access Control & Auditing:** Require strict role-based access control (RBAC) and maintain tamper-evident audit logs capturing every read, write, update, or export operation on health records.

---

## 4. Digital Accessibility & Child Protection

### 4.1 Digital Accessibility Standards (WCAG 2.2 AA / EAA)
* **Screen Reader & Keyboard Navigability:** Ensure all UI elements contain accessible labels (`aria-label`, semantic HTML tags, or native accessibility traits) and support full keyboard/screen-reader navigation.
* **Visual Standards:** Maintain a minimum contrast ratio of `4.5:1` for normal text and `3:1` for large text. Never rely exclusively on color to convey state or validation errors.

### 4.2 Child Data Protection & Age Verification (COPPA / Age-Appropriate Design Code)
* **Age Gating:** Implement age-verification gates before collecting personal information if the app targets or attracts minors.
* **Zero Behavioral Tracking for Minors:** Disable targeted advertising, behavioral tracking, push notifications, and precise geolocation features by default for users under the legal age of digital consent (13 in US, 16 in EU/UK).

---

## 5. Data Sovereignty & Cross-Border Transfer

### 5.1 Data Localization & Regional Storage
* **Geographic Pinning:** Support multi-region database routing to store user PII strictly within its originating legal jurisdiction (e.g., EU data in EU regions for GDPR, Indian personal data within India per DPDP, UAE data in UAE endpoints).
* **Cross-Border Guardrails:** Validate and block automated egress transfer of un-encrypted PII across regional cloud boundaries without verified transfer mechanisms (e.g., EU Standard Contractual Clauses).

---

## 6. System Security, Access Control & Auditability

### 6.1 Authentication & Zero Trust Access
* **Multi-Factor Authentication (MFA):** Enforce MFA for all administrative endpoints, privileged workflows, and internal tooling accesses.
* **Principle of Least Privilege (PoLP):** Configure service accounts, database connections, and cloud roles with minimal operational permissions. Block raw database `ROOT` or `DBA` usage in application code.
* **Secure Session Management:** Store session keys or tokens in `HttpOnly`, `Secure`, and `SameSite=Strict` cookies (or OS Keychains/Keystores on mobile). Set maximum token lifespans (e.g., 15-minute access token expiry).

### 6.2 Logging, Telemetry & PII Redaction
* **Zero PII in Logs:** Scrub and redact all sensitive parameters (passwords, JWTs, credit card numbers, email addresses, IP addresses) prior to writing to standard output or log stream processors.
* **Immutable Audit Trail:** Maintain immutable, write-once-read-many (WORM) security logs for critical operations (privilege escalation, data exports, schema changes, configuration changes).

### 6.3 Vulnerability Mitigation & Supply Chain Safety
* **Input Sanitization & Output Encoding:** Sanitize all user-controlled input against SQL Injection, Command Injection, and SSRF. Encode output to prevent Cross-Site Scripting (XSS).
* **Software Supply Chain Integrity:** Pin explicit lockfiles for software dependencies. Enforce automated dependency scanning for known vulnerabilities (CVEs) and permissive license conflicts (e.g., flagging viral GPL licenses in proprietary applications).

---

## 7. Incident Management, Breach Notification & AI Governance

### 7.1 Incident Response & Breach Notification Requirements
* **Automated Telemetry Alerts:** Configure real-time alerts for unauthorized access attempts, large-scale data exports, or cryptographic failures.
* **72-Hour Breach Tracking:** Maintain audit records and logs necessary to compile full exposure assessments within strict regulatory notification windows (e.g., 72 hours for GDPR/DPDP).

### 7.2 AI Systems & Automated Decision-Making (EU AI Act, ISO 42001)
* **Opt-Out of Automated Profiling:** Provide explicit user settings to opt out of automated decision-making or profiling algorithms that yield legal effects.
* **Auditability & Explainability:** Maintain logging on inputs, prompts, confidence scores, and model versions used in automated scoring or decision-making pipelines.