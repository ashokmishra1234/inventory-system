# AI-Powered Blockchain Inventory Management System

> **Technical Documentation & Pitch Deck**

## 1. Executive Summary

**The Problem:**
Traditional inventory systems are static. Retailers struggle with:

- Manual data entry errors.
- Lack of real-time visibility into stock.
- No "smart" assistance for negotiations or insights.
- Trust issues regarding audit trails and stock history.

**The Solution:**
We have built a **Next-Generation Inventory Platform** that combines three cutting-edge technologies:

1.  **Artificial Intelligence (Gemini 2.5):** Acts as a smart shopkeeper assistant (Sales/Support).
2.  **Blockchain (Ethereum/Sepolia):** Provides an immutable, tamper-proof audit trail for every stock movement.
3.  **Real-Time Cloud Database (Supabase):** Ensures instant synchronization across devices.

**Target Audience:**

- **Retailers:** For managing shops efficiently with voice & AI.
- **Wholesalers:** For tracking distribution.
- **Admins:** For overseeing system integrity via Blockchain audits.

---

## 2. System Architecture

This High-Level Architecture demonstrates how the User interacts with the modern web stack and how data flows securely to both the Database and the Blockchain.

```mermaid
graph TD
    User(("User / Retailer"))

    subgraph Frontend_Layer ["Frontend (React + Vite)"]
        UI[Web Interface]
        Voice["Web Speech API<br/>(Mic & Speaker)"]
    end

    subgraph Backend_Layer ["Backend (Node.js + Express)"]
        API[API Gateway]
        Auth[Auth Middleware]
        AIService["AI Service<br/>(Gemini 2.5)"]
        BCService["Blockchain Service<br/>(Ethers.js)"]
        SmartDiscount[Discount Logic]
    end

    subgraph Data_Layer ["Data & Storage"]
        DB[("Supabase DB<br/>PostgreSQL")]
        Blockchain[("Ethereum Sepolia<br/>Smart Contract")]
    end

    User <-->|Clicks / Voice| UI
    UI <-->|HTTPS| API
    UI <-->|Inputs| Voice

    API --> Auth
    Auth -->|"Read/Write"| DB

    API -->|"Intent & RAG"| AIService
    AIService -->|"Context Query"| DB

    API -->|"Log Transaction"| BCService
    BCService -->|"Immutable Record"| Blockchain
```

---

## 3. Detailed Working (Step-by-Step)

1.  **User Login:**

    - Retailers log in via secure Email/Password (Supabase Auth).
    - System loads their specific, private inventory (Row Level Security).

2.  **Adding a Product:**

    - Retailer speaks: "Add 50 Dettol soaps at 45 rupees."
    - AI parses this, auto-fills the form.
    - Retailer confirms -> Saved to DB -> Hash logged on Blockchain.

3.  **Updating Stock:**

    - When sales happen, stock decreases.
    - System automatically calculates "Low Stock" alerts.
    - Every update creates a tamper-proof audit log.

4.  **Selling & Billing:**

    - User adds items to cart.
    - Payment processed via **Razorpay** (UPI/Card) or Cash.
    - Invoice generated and stock deducted instantly.

5.  **AI Interaction:**
    - User asks: "Dettol hai kya?"
    - AI checks DB.
    - AI replies (Voice + Text): "Haan ji, 50 pc available hai."

---

## 4. Operational Flowcharts

### A. Product Add Flow

```mermaid
flowchart LR
    User([User]) -->|"Voice/Text Input"| UI[Frontend UI]
    UI -->|"API Request"| Backend
    Backend -->|Insert| DB[(Database)]
    DB -->|Success| Backend
    Backend -->|"Log Event"| BC[Blockchain Layer]
    BC -->|Confirm| UI
    UI -->|Notification| User
```

### B. Inventory Update Flow

```mermaid
flowchart TD
    Action["Stock Update / Sale"] -->|Trigger| API
    API -->|"Update Quantity"| DB[(Supabase)]
    DB -->|"Trigger Log"| Logger
    Logger -->|"Write Hash"| Eth[Ethereum Sepolia]
    Eth -->|"Return TxHash"| API
    API -->|"Save Audit Trail"| DB
```

### C. Billing / POS Flow

```mermaid
flowchart TD
    Start([Start Checkout]) --> Cart["Add Items to Cart"]
    Cart --> Pay{"Payment Mode?"}
    Pay -- Cash --> Invoice
    Pay -- Online --> Razorpay["Razorpay Gateway"]
    Razorpay -- Success --> Invoice["Generate Invoice"]
    Invoice --> Deduct["Deduct Stock from DB"]
    Deduct --> Audit["Log Sale on Blockchain"]
    Audit --> End([End])
```

### D. AI Interaction Flow

```mermaid
flowchart TD
    Input(["User Voice Input"]) -->|"Speech-to-Text"| Text
    Text -->|"Send API"| Backend
    Backend -->|"Regex + Gemini"| Intent{Detect Intent}

    Intent -- "Stock Check" --> QueryDB[("Query Inventory")]
    Intent -- "Discount" --> SmartLogic["Check Max Discount"]

    QueryDB --> Context["Data Context"]
    SmartLogic --> Context

    Context -->|RAG| GenAI["Gemini Generator"]
    GenAI -->|"Hinglish Response"| Response
    Response -->|"Text-to-Speech"| Audio(["User Hears Audio"])
```

### E. Blockchain Logging Flow

```mermaid
sequenceDiagram
    participant App as Application
    participant DB as Database
    participant BC as Blockchain (Sepolia)

    App->>DB: 1. Save Critical Action (e.g., Price Change)
    App->>BC: 2. Send Transaction (Log Hash + Metadata)
    BC-->>App: 3. Return Transaction Hash (0x123...)
    App->>DB: 4. Store TxHash in Audit Table
    Note over App, BC: The record is now linked forever.
```

---

## 5. Data Flow Diagram

This illustrates how data moves through the core services.

```mermaid
graph LR
    subgraph Client
        Browser["Browser / React App"]
    end

    subgraph Server_Services
        Node["Node.js Server"]
        AI["AI Engine"]
        EthClient["Ethers.js Client"]
    end

    subgraph Storage
        Postgres[("PostgreSQL")]
        SmartContract["Smart Contract"]
    end

    Browser <-->|"JSON Data"| Node
    Node <-->|"SQL Queries"| Postgres
    Node <-->|"Prompts & Context"| AI
    Node -->|"Write Logs"| EthClient
    EthClient -->|Transactions| SmartContract
```

---

## 6. Core Components

- **Frontend:** React.js, TailwindCSS, Vite. (Fast, Responsive, Local First).
- **Backend:** Node.js, Express.js. (Scalable API handling).
- **Database:** Supabase (PostgreSQL). Stores Users, Products, Logs.
- **AI Module:** Google Gemini 2.5 Flash. Handles logic, intent, and persona.
- **Blockchain Module:** Ethereum (Sepolia Testnet). Stores immutable hashes of critical events.
- **Payment Gateway:** Razorpay. Handles secure payments.

---

## 7. Database Schema

Simple explanation of the data structure.

| Table Name               | Purpose                                                        |
| :----------------------- | :------------------------------------------------------------- |
| **`retailers`**          | Stores user profiles and shop details.                         |
| **`retailer_inventory`** | The main stock list. Private to each retailer (RLS protected). |
| **`master_catalog`**     | A shared database of common products (Global barcodes/images). |
| **`transactions`**       | Sales records, payment status, and invoices.                   |
| **`audit_logs`**         | Links a DB action ID to a Blockchain Transaction Hash.         |

---

## 8. AI Module Documentation

**Feature Set:**

1.  **Speech-to-Text:** Converts shopkeeper's voice to command.
2.  **Intent Recognition:** "Hybrid Brain" uses local Regex (fast) + Cloud AI (smart).
3.  **Smart Negotiation:** Hides maximum discount if the user asks for less.
4.  **Persona:** Speaks in a localized "Hinglish" shopkeeper tone.
5.  **RAG (Retrieval Augmented Generation):** Reads _actual_ database stock before answering.

**Safety:** The AI **Read-Only** access to data. It cannot delete or modify stock on its own. It never writes directly to the Blockchain.

---

## 9. Blockchain Module Documentation

**Why Blockchain?** To prevents "cooked books" or internal fraud.
**What is logged?**

- Stock Additions (Proof of Inventory).
- Price Changes (Proof of Pricing).
- Large Deletions (Proof of Waste/Theft).
  **Immutability:** Once written to the Ethereum network, the record cannot be changed by anyone, not even the admin.
  **Verification:** Any log can be verified on a public explorer (like Etherscan) using the Transaction Hash.

---

## 10. Security & Anti-Theft Logic

1.  **Authentication:** Secure JWT login via Supabase.
2.  **Row Level Security (RLS):** Retailer A cannot see Retailer B's stock.
3.  **Audit Trails:** Every sensitive action generates a "Digital Fingerprint" stored on-chain.
4.  **Role-Based Access:** Cashiers can sell, but only Managers/Admins can delete stock.

---

## 11. Deployment Overview

- **Frontend:** Hosted on **Vercel** (Global CDN, fast loading).
- **Backend:** Hosted on **Render / Vercel Serverless**.
- **Database:** Managed **Supabase** Cloud.
- **Blockchain:** Decentralized **Sepolia Network**.

---

## 12. Conclusion

This system transforms a simple inventory spreadsheet into a **smart, secure, and voice-activated assistant**.

- **AI** saves time and improves customer interaction.
- **Blockchain** builds trust and security.
- **Cloud** ensures access from anywhere.

It is **Future-Ready**, scalable to thousands of products, and designed for the modern retailer.
