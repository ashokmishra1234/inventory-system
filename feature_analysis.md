# Feature Feasibility Analysis

You proposed two advanced features. Here is my technical analysis of their feasibility, complexity, and architectural fit.

## Feature 1: "Bring Your Own Database" (BYO-DB)

_User passes their own database key/password to use their personal database._

### Analysis

- **Current Architecture**: We use **Multi-Tenancy via RLS**. All data lives in one big secure database, but "Row Level Security" ensures User A cannot see User B's data.
- **Proposed Architecture**: **Isolated Tenancy**. The app connects to a _different_ physical database for every user.

| Aspect         | Verdict       | Reasoning                                                                                                                                                   |
| :------------- | :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Complexity** | **Extreme**   | The Backend would need to maintain dynamic connection pools. Connecting to a new DB takes time (~500ms), making the app feel slow if done on every request. |
| **Security**   | **High Risk** | We would have to store User Database Passwords in our server. If we get hacked, _their_ databases get hacked.                                               |
| **Cost**       | **High**      | Hosting 1000 separate Postgres instances is expensive compared to 1 shared instance.                                                                        |

### Recommendation: **Avoid**

**Why?** The current Schema (RLS) already provides the _effect_ of a private database (complete isolation) without the nightmare of managing 1000 connections.
**Better Alternative**: Allow users to "Export" their data as SQL/CSV if they want ownership, rather than letting them host the DB live.

---

## Feature 2: "Scan Bill to Add Stock" (AI OCR)

_Scan a paper bill from a wholesaler, and automatically parse products + quantity to update inventory._

### Analysis

- **Feasibility**: **High**. This is a classic use case for AI/OCR.
- **Technology Needed**:
  1.  **OCR Service**: Google Cloud Vision API, AWS Textract, or Azure Form Recognizer.
  2.  **LLM Parser**: Raw OCR gives messy text. You need an AI (like Gemini/GPT) to convert "Det-500ml... $45 x 10" into JSON `{"sku": "DET", "qty": 10}`.

### Implementation Plan (Future Phase)

1.  **Mobile Upload**: User takes photo of invoice.
2.  **Processing**:
    - Server sends image to **OCR Provider** -> Gets text.
    - Server sends text to **LLM** -> "Extract items and quantities".
3.  **Verification UI**:
    - **Crucial Step**: AI makes mistakes (e.g., reading "50" as "5O").
    - User sees a "Draft Order" table > confirms > Clicks "Import".
4.  **Database Update**: System runs the `addToInventory` logic we just built.

### Recommendation: **Approved for Phase 3**

This is a high-value "Wow" feature.

- **Cost**: Costs money per scan (API fees).
- **Effort**: Moderate (Frontend File Upload + Backend API integration).
