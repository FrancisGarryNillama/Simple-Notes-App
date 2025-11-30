package com.backend.notesapp.service;

import com.backend.notesapp.dto.CreateTxRequest;
import com.backend.notesapp.dto.UpdateTxRequest;
import com.backend.notesapp.exception.ResourceNotFoundException;
import com.backend.notesapp.models.TxStatus;
import com.backend.notesapp.repository.NoteChainTxRepository;
import com.backend.notesapp.repository.NoteRepository;
import com.backend.notesapp.models.NoteChainTx;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ChainService {

    private final NoteChainTxRepository txRepo;
    private final NoteRepository noteRepo;
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${CHAIN_API_KEY:default_secret_key}")
    private String serverApiKey;

    public ChainService(NoteChainTxRepository txRepo, NoteRepository noteRepo) {
        this.txRepo = txRepo;
        this.noteRepo = noteRepo;
    }

    private boolean ownsNote(Integer userId, Integer noteId) {
        // TODO: Implement real user auth check
        // For now, return true to allow all operations
        return true;
    }

    @Transactional
    public NoteChainTx createTx(CreateTxRequest req, Integer userId) throws Exception {

        // Validate transaction hash format (64 lowercase hex characters)
        if (req.getTx_hash() == null || !req.getTx_hash().matches("^[0-9a-f]{64}$")) {
            throw new IllegalArgumentException("Invalid tx_hash format. Must be 64 lowercase hex characters.");
        }

        // Validate note exists
        if (!noteRepo.existsById(req.getNote_id())) {
            throw new ResourceNotFoundException("Note not found with ID: " + req.getNote_id());
        }

        // Check ownership (when auth is implemented)
        if (!ownsNote(userId, req.getNote_id())) {
            throw new SecurityException("Forbidden: You don't own this note");
        }

        // Check for duplicate transaction
        Optional<NoteChainTx> existing = txRepo.findByTxHash(req.getTx_hash());
        if (existing.isPresent()) {
            // Return existing transaction (idempotent behavior)
            return existing.get();
        }

        // Create new transaction record
        NoteChainTx tx = new NoteChainTx();
        tx.setNoteId(req.getNote_id());
        tx.setUserId(userId);
        tx.setTxHash(req.getTx_hash());
        tx.setAmount(req.getAmount());
        tx.setCurrency(req.getCurrency() != null ? req.getCurrency() : "ADA");
        tx.setExternalRef(req.getExternal_ref());
        tx.setStatus(TxStatus.pending);  // Initially pending

        // Convert metadata to JSON string
        if (req.getMetadata() != null) {
            tx.setMetadata(mapper.writeValueAsString(req.getMetadata()));
        } else {
            tx.setMetadata("{}");
        }

        return txRepo.save(tx);
    }

    public List<NoteChainTx> getTxsByNote(Integer noteId) {
        return txRepo.findByNoteIdOrderByCreatedAtDesc(noteId);
    }

    @Transactional
    public NoteChainTx updateTx(UpdateTxRequest req, String apiKey) throws Exception {

        // Validate API key for internal updates
        if (!apiKey.equals(serverApiKey)) {
            throw new SecurityException("Invalid API key");
        }

        // Find transaction
        NoteChainTx tx = txRepo.findByTxHash(req.getTx_hash())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found: " + req.getTx_hash()));

        // Update status
        if (req.getStatus() != null) {
            try {
                tx.setStatus(TxStatus.valueOf(req.getStatus()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status. Must be: pending, confirmed, or failed");
            }
        }

        // Update block height
        if (req.getBlock_height() != null) {
            tx.setBlockHeight(req.getBlock_height());
        }

        return txRepo.save(tx);
    }

    public List<NoteChainTx> getPending(int limit, String apiKey) {

        // Validate API key
        if (!apiKey.equals(serverApiKey)) {
            throw new SecurityException("Invalid API key");
        }

        List<NoteChainTx> list = txRepo.findByStatusOrderByCreatedAtAsc(TxStatus.pending);

        if (limit > 0 && list.size() > limit) {
            return list.subList(0, limit);
        }

        return list;
    }

    // Get all transactions (optional, for admin purposes)
    public List<NoteChainTx> getAllTransactions() {
        return txRepo.findAll();
    }

    // Get transaction statistics
    public Map<String, Object> getTransactionStats() {
        long totalCount = txRepo.count();
        long pendingCount = txRepo.countByStatus(TxStatus.pending);
        long confirmedCount = txRepo.countByStatus(TxStatus.confirmed);
        long failedCount = txRepo.countByStatus(TxStatus.failed);

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", totalCount);
        stats.put("pending", pendingCount);
        stats.put("confirmed", confirmedCount);
        stats.put("failed", failedCount);

        return stats;
    }
}