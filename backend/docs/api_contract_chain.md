# API Contract — Chain / Wallet Integration

This document defines the backend API endpoints required to support blockchain transaction recording and wallet integration for the Notes App.

---

# Base Path

/api/chain

# ## 1) POST `/api/chain/tx`

Insert a blockchain transaction linked to a note.

### **Request Body**
```json
{
  "note_id": 12,
  "tx_hash": "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
  "amount": 1.234,
  "currency": "ADA",
  "metadata": { "noteRef": 12, "action": "attach" },
  "external_ref": "optional-provider-id"
}
Success Response

{ "success": true, "id": 123, "tx_hash": "abcdef..." }

## 2) GET /api/chain/txs?noteId=<id>

Fetch all blockchain transactions for a specific note.

Success Response

{
  "success": true,
  "transactions": [
    {
      "id": 123,
      "note_id": 12,
      "user_id": 1,
      "tx_hash": "abcdef...",
      "status": "pending",
      "amount": 1.234,
      "currency": "ADA",
      "metadata": { "noteRef": 12, "action": "attach" },
      "block_height": null,
      "created_at": "2025-11-28T12:34:56Z"
    }
  ]
}
## 3) POST /api/chain/tx/update
Update a transaction’s status.
Internal use only.

Headers
X-API-KEY: <server-secret>

Request Body
{
  "tx_hash": "abcdef...",
  "status": "confirmed",
  "block_height": 123456
}

## 4) GET /api/chain/pending?limit=50

Return all pending transactions for polling systems.

Headers
X-API-KEY: <server-secret>

Success Response
{
  "success": true,
  "pending": [
    {
      "id": 123,
      "tx_hash": "abcdef...",
      "created_at": "2025-11-28T12:34:56Z"
    }
  ]
}

Implementation Notes
General Rules

tx_hash must be exactly 64 hex characters, lowercase.

POST /api/chain/tx must verify the authenticated user owns the note_id. Return 403 Forbidden if not.

Duplicate transaction handling:

Option A: return 409 Conflict

Option B: return 200 OK with "existing": true

Backend developer must choose one consistent behavior.

Timestamps must use ISO8601 UTC (e.g., 2025-11-28T12:34:56Z).

For POST /api/chain/tx/update, define whether metadata is merged or replaced.
Recommended: merge existing + new metadata.

Store all secrets (X-API-KEY, Blockfrost key) in environment variables.
Never commit secrets to the repository.

Poller jobs must respect Blockfrost rate limits.

Spring-Specific Notes (Important for Backend Developer)

Metadata Column Type:
The metadata column is JSON in MySQL.
If using H2 for local testing, configure JSON → TEXT mapping, or use MySQL only during development.

Enum Mapping:
SQL ENUM('pending','confirmed','failed') should be mapped to a Java enum or String.
(Java enum recommended.)

JPA Entity Suggestions:
Use:

@Enumerated(EnumType.STRING)
private TxStatus status;


And store metadata as:

@Column(columnDefinition = "json")
private String metadata;


Use @Transactional:
On insert (/tx), use a transactional repository method to avoid duplicate tx_hash race conditions.

Pagination:
Allow optional limit and offset for GET /api/chain/txs.

CORS:
Enable CORS for the frontend origin while in development.
