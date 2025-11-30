package com.backend.notesapp.controller;

import com.backend.notesapp.dto.CreateTxRequest;
import com.backend.notesapp.dto.UpdateTxRequest;
import com.backend.notesapp.service.ChainService;
import com.backend.notesapp.models.NoteChainTx;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/chain")
public class ChainController {

    private final ChainService chainService;

    public ChainController(ChainService chainService) {
        this.chainService = chainService;
    }

    /**
     * POST /api/chain/tx
     * Create a new blockchain transaction record
     */
    @PostMapping("/tx")
    public ResponseEntity<Map<String, Object>> create(@RequestBody CreateTxRequest req) {
        try {
            Integer userId = 1; // TODO: Get from authentication context

            NoteChainTx tx = chainService.createTx(req, userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("id", tx.getId());
            response.put("tx_hash", tx.getTxHash());
            response.put("status", tx.getStatus().toString());
            response.put("created_at", tx.getCreatedAt());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);

        } catch (SecurityException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Forbidden: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * GET /api/chain/txs?noteId=<id>
     * Get all transactions for a specific note
     */
    @GetMapping("/txs")
    public ResponseEntity<Map<String, Object>> getTxs(@RequestParam Integer noteId) {
        try {
            List<NoteChainTx> list = chainService.getTxsByNote(noteId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("transactions", list);
            response.put("count", list.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * POST /api/chain/tx/update
     * Update transaction status (internal use)
     */
    @PostMapping("/tx/update")
    public ResponseEntity<Map<String, Object>> update(
            @RequestHeader("X-API-KEY") String key,
            @RequestBody UpdateTxRequest req
    ) {
        try {
            NoteChainTx tx = chainService.updateTx(req, key);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("tx_hash", tx.getTxHash());
            response.put("status", tx.getStatus().toString());
            response.put("block_height", tx.getBlockHeight());

            return ResponseEntity.ok(response);

        } catch (SecurityException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Unauthorized: Invalid API key");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * GET /api/chain/pending?limit=50
     * Get pending transactions (internal use)
     */
    @GetMapping("/pending")
    public ResponseEntity<Map<String, Object>> getPending(
            @RequestHeader("X-API-KEY") String key,
            @RequestParam(defaultValue = "50") Integer limit
    ) {
        try {
            List<NoteChainTx> pending = chainService.getPending(limit, key);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("pending", pending);
            response.put("count", pending.size());

            return ResponseEntity.ok(response);

        } catch (SecurityException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Unauthorized: Invalid API key");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * GET /api/chain/stats
     * Get transaction statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        try {
            Map<String, Object> stats = chainService.getTransactionStats();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stats", stats);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}