# 🔄 Complete System Flow Diagrams

## System Architecture Flow

```mermaid
graph TB
    subgraph User["👤 User"]
        Browser[Web Browser<br/>localhost:5173]
    end
    
    subgraph Frontend["⚛️ Frontend (React)"]
        Login[Login Page]
        Dashboard[Dashboard]
        Inventory[My Inventory]
        Billing[Billing/POS]
        Blockchain[Blockchain Audit]
    end
    
    subgraph Backend["🔧 Backend (Node.js)"]
        API[Express API<br/>:5000]
        InvCtrl[Inventory Controller]
        PayCtrl[Payment Controller]
        BCService[Blockchain Service]
    end
    
    subgraph Storage["💾 Storage"]
        DB[(Supabase<br/>PostgreSQL)]
        SC[Smart Contract<br/>Sepolia]
    end
    
    Browser --> Login
    Browser --> Dashboard
    Browser --> Inventory
    Browser --> Billing
    Browser --> Blockchain
    
    Inventory --> API
    Billing --> API
    Blockchain --> API
    
    API --> InvCtrl
    API --> PayCtrl
    
    InvCtrl --> DB
    InvCtrl --> BCService
    PayCtrl --> DB
    PayCtrl --> BCService
    
    BCService --> SC
    
    style Browser fill:#60a5fa
    style DB fill:#22c55e
    style SC fill:#f59e0b
    style BCService fill:#ec4899
```

---

## Add Product Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend
    participant API as Backend API
    participant DB as Supabase
    participant BC as Blockchain Service
    participant SC as Smart Contract
    
    User->>UI: Click "Add Product"
    User->>UI: Fill form (name, SKU, price, qty)
    User->>UI: Click "Save"
    
    UI->>API: POST /api/inventory
    
    Note over API: Validate input
    
    API->>DB: INSERT product
    DB-->>API: Success ✅
    API-->>UI: 201 Created
    UI-->>User: ✅ Success message
    
    Note over User: User sees product immediately
    
    par Async Blockchain Logging
        API->>BC: recordActionAsync()
        BC->>SC: Call recordAction()
        Note over SC: Validate & Store
        SC-->>BC: Transaction hash
        BC-->>API: Log confirmation
        Note over API: Console: ✅ Blockchain confirmed
    end
```

---

## Complete Sales Flow (POS)

```mermaid
sequenceDiagram
    actor User
    participant UI as Billing Page
    participant API as Backend
    participant RP as Razorpay
    participant DB as Database
    participant BC as Blockchain
    
    User->>UI: Select products
    User->>UI: Choose payment method
    
    alt Cash Payment
        User->>UI: Click "Pay Cash"
        UI->>API: POST /payment/cash
        API->>DB: Record transaction
        API->>DB: Reduce stock
        API->>BC: Log to blockchain
        API-->>UI: Success
        UI-->>User: ✅ Sale complete
    else Online Payment
        User->>UI: Click "Pay Online"
        UI->>API: POST /payment/create-order
        API->>RP: Create order
        RP-->>API: Order details
        API-->>UI: Order ID
        UI->>User: Show Razorpay modal
        User->>RP: Enter card details
        RP-->>UI: Payment success
        UI->>API: POST /payment/verify
        API->>RP: Verify signature
        API->>DB: Record transaction
        API->>DB: Reduce stock
        API->>BC: Log to blockchain
        API-->>UI: Success
        UI-->>User: ✅ Payment verified
    end
```

---

## Blockchain Verification Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Blockchain Page
    participant API as Backend
    participant BC as Blockchain Service
    participant SC as Smart Contract
    participant ES as Etherscan
    
    User->>UI: Visit /blockchain
    UI->>API: GET /blockchain/stats
    API->>BC: Get stats
    BC->>SC: Call getTotalEvents()
    SC-->>BC: Event count
    BC-->>API: Stats data
    API-->>UI: JSON response
    UI-->>User: Show dashboard
    
    Note over User: Sees: Status, Events, Contract
    
    User->>UI: Click "View on Etherscan"
    UI->>ES: Open contract URL
    ES-->>User: Show contract page
    
    Note over User: Verifies on public blockchain
```

---

## Daily Operations Flow

```mermaid
flowchart TD
    Start([Morning: Login]) --> CheckInv[Check Inventory]
    CheckInv --> LowStock{Low Stock?}
    
    LowStock -->|Yes| AddStock[Add New Stock]
    LowStock -->|No| WaitSales[Wait for Customers]
    
    AddStock --> BCLog1[🔗 Blockchain: StockAdded]
    BCLog1 --> WaitSales
    
    WaitSales --> Customer[Customer Arrives]
    Customer --> SelectItems[Select Items]
    SelectItems --> Checkout[Checkout]
    
    Checkout --> PayMethod{Payment Method?}
    
    PayMethod -->|Cash| CashPay[Process Cash]
    PayMethod -->|Online| OnlinePay[Process Razorpay]
    
    CashPay --> RecordSale[Record Transaction]
    OnlinePay --> RecordSale
    
    RecordSale --> ReduceStock[Reduce Stock]
    ReduceStock --> BCLog2[🔗 Blockchain: SaleCompleted]
    
    BCLog2 --> MoreCustomers{More Customers?}
    
    MoreCustomers -->|Yes| Customer
    MoreCustomers -->|No| EOD[End of Day]
    
    EOD --> ViewBC[View Blockchain Audit]
    ViewBC --> VerifyES[Verify on Etherscan]
    VerifyES --> End([Logout])
    
    style BCLog1 fill:#f59e0b
    style BCLog2 fill:#f59e0b
    style ViewBC fill:#60a5fa
    style VerifyES fill:#22c55e
```

---

## Product Lifecycle on Blockchain

```mermaid
stateDiagram-v2
    [*] --> ProductAdded: Add Product
    
    ProductAdded --> StockAdjusted: Update Quantity
    StockAdjusted --> StockAdjusted: Restock
    StockAdjusted --> SaleCompleted: Sell Units
    SaleCompleted --> StockAdjusted: More Stock
    SaleCompleted --> ProductRemoved: Discontinue
    
    ProductRemoved --> [*]
    
    note right of ProductAdded
        🔗 Event #1
        SKU, Initial Qty, Price
        Actor, Timestamp
    end note
    
    note right of StockAdjusted
        🔗 Event #2, #3, #4...
        Old Qty, New Qty
        Change Amount
    end note
    
    note right of SaleCompleted
        🔗 Event #N
        Items Sold
        Payment Method
        Total Amount
    end note
    
    note right of ProductRemoved
        🔗 Final Event
        Reason for Removal
        Final Qty
    end note
```

---

## Multi-User Data Flow

```mermaid
graph TB
    subgraph Retailer1["👤 Retailer 1"]
        R1Actions[Add Product A<br/>Sell 5 units<br/>Update stock]
    end
    
    subgraph Retailer2["👤 Retailer 2"]
        R2Actions[Add Product B<br/>Sell 10 units<br/>Update stock]
    end
    
    subgraph Admin["👨‍💼 Admin"]
        AdminView[View All Logs<br/>Monitor Activity]
    end
    
    subgraph Database["💾 Supabase (Multi-Tenant)"]
        R1Data[(Retailer 1<br/>Inventory)]
        R2Data[(Retailer 2<br/>Inventory)]
    end
    
    subgraph Blockchain["⛓️ Blockchain (Shared)"]
        Events[Event #1: Retailer1-ProductAdded<br/>Event #2: Retailer2-ProductAdded<br/>Event #3: Retailer1-Sale<br/>Event #4: Retailer2-Sale<br/>...<br/>All events with Actor ID]
    end
    
    R1Actions --> R1Data
    R2Actions --> R2Data
    
    R1Actions --> Events
    R2Actions --> Events
    
    AdminView --> R1Data
    AdminView --> R2Data
    AdminView --> Events
    
    style Events fill:#f59e0b
    style R1Data fill:#22c55e
    style R2Data fill:#22c55e
```

---

*These diagrams show how your blockchain-integrated system works end-to-end!*
