API Contract — Chain / Wallet Integration

This document defines the backend API endpoints required to support blockchain transaction recording and wallet integration for the Notes App.

Base Path
/api/chain

## 1) POST /api/chain/tx

Insert a blockchain transaction linked to a note.

Request Body
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

Return all pending transactions for polling.

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

# Implementation Notes

Validate tx_hash is exactly 64 hex characters (normalize to lowercase).

POST /api/chain/tx must verify the authenticated user owns the provided note_id. Return 403 Forbidden if not.

Duplicate handling: if tx_hash already exists, return either 409 Conflict or 200 OK with "existing": true.

Timestamps should use ISO8601 UTC, e.g., 2025-11-28T12:34:56Z.

For POST /api/chain/tx/update, decide whether metadata is merged or replaced (recommended: merge).

Store secrets (X-API-KEY, Blockfrost API key) in environment variables — never commit them.

Polling system must respect Blockfrost rate limits.
