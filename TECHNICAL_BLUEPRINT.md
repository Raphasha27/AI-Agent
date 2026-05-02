# 🏛️ Technical Blueprint: Sumbandila National Ecosystem
### Governance by Kirov Dynamics Technology

---

## 🗺️ System Architecture

```mermaid
graph TD
    subgraph ClientLayer ["Client Layer"]
        Landing["🏠 Next.js Landing Portal"]
        Web["🌐 React Admin Dashboard"]
        Mobile["📱 React Native Mobile App"]
    end

    subgraph LogicLayer ["Logic & Security Layer"]
        API["⚙️ FastAPI Core API"]
        Sentinel["🛡️ L5 Sentinel Encryption"]
        POPIA["⚖️ POPIA DLP Engine"]
    end

    subgraph PersistenceLayer ["Persistence Layer"]
        DB[(🗄️ PostgreSQL / Supabase)]
        Redis[(⚡ Redis Cache)]
        Registry[(📊 National Registry Storage)]
    end

    Landing <--> API
    Web <--> API
    Mobile <--> API
    API <--> Sentinel
    API <--> POPIA
    API <--> DB
    API <--> Redis
    API <--> Registry
```

---

## 🔄 National Verification Flow

```mermaid
sequenceDiagram
    participant Citizen as 🇿🇦 Citizen
    participant Portal as 🏠 Landing Portal
    participant API as ⚙️ Core API
    participant Sentinel as 🛡️ L5 Sentinel
    participant Registry as 📊 National Registry

    Citizen->>Portal: Submit Verification Request
    Portal->>API: POST /verify/credential
    API->>Sentinel: Hash Identification (SHA-256)
    Sentinel-->>API: Secure Fingerprint
    API->>Registry: Query Fingerprint Status
    Registry-->>API: Return Status (Accredited/Fraud)
    API-->>Portal: Result (Green/Yellow/Red)
    Portal-->>Citizen: Display Trust Badge
```

---

## 🛡️ Security Posture (L5 Sentinel)
The Sumbandila platform implements the **L5 Sentinel** protocol, ensuring that no sensitive PII is ever stored in plain text.
- **Transport Layer**: Enforced TLS 1.3 for all inter-service communication.
- **Data at Rest**: AES-256 encryption for all registry records.
- **Anonymization**: Citizens are tracked via SHA-256 fingerprints, preserving privacy while enabling national-scale verification.

---

## 📈 Platform Growth Pulse
Real-time monitoring of the national registry expansion.

```mermaid
pie title Registered Institutions (April 2026)
    "TVET Colleges" : 2450
    "Universities" : 520
    "HPCSA Practitioners" : 12450
    "LPC Legal Entities" : 3200
    "Verified Schools" : 15800
```

---
© 2026 Kirov Dynamics Technology · All Rights Reserved.
