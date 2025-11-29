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

    @Value("${CHAIN_API_KEY}")
    private String serverApiKey;

    public ChainService(NoteChainTxRepository txRepo, NoteRepository noteRepo) {
        this.txRepo = txRepo;
        this.noteRepo = noteRepo;
    }

    private boolean ownsNote(Integer userId, Integer noteId) {
        // TODO: integrate real auth
        return true;
    }

    @Transactional
    public NoteChainTx createTx(CreateTxRequest req, Integer userId) throws Exception {

        if (!req.getTx_hash().matches("^[0-9a-f]{64}$")) {
            throw new IllegalArgumentException("Invalid tx_hash format");
        }

        if (!noteRepo.existsById(req.getNote_id())) {
            throw new ResourceNotFoundException("Note not found");
        }

        if (!ownsNote(userId, req.getNote_id())) {
            throw new SecurityException("Forbidden");
        }

        Optional<NoteChainTx> existing = txRepo.findByTxHash(req.getTx_hash());
        if (existing.isPresent()) {
            return existing.get(); // Option B of your contract
        }

        NoteChainTx tx = new NoteChainTx();
        tx.setNoteId(req.getNote_id());
        tx.setUserId(userId);
        tx.setTxHash(req.getTx_hash());
        tx.setAmount(req.getAmount());
        tx.setCurrency(req.getCurrency());
        tx.setExternalRef(req.getExternal_ref());
        tx.setStatus(TxStatus.pending);

        // Convert metadata → JSON
        tx.setMetadata(req.getMetadata() == null ? "{}" : mapper.writeValueAsString(req.getMetadata()));

        return txRepo.save(tx);
    }

    public List<NoteChainTx> getTxsByNote(Integer noteId) {
        return txRepo.findByNoteIdOrderByCreatedAtDesc(noteId);
    }

    @Transactional
    public NoteChainTx updateTx(UpdateTxRequest req, String apiKey) throws Exception {

        if (!apiKey.equals(serverApiKey))
            throw new SecurityException("Invalid API key");

        NoteChainTx tx = txRepo.findByTxHash(req.getTx_hash())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        // Update status
        tx.setStatus(TxStatus.valueOf(req.getStatus()));

        if (req.getBlock_height() != null)
            tx.setBlockHeight(req.getBlock_height());

        return txRepo.save(tx);
    }

    public List<NoteChainTx> getPending(int limit, String apiKey) {
        if (!apiKey.equals(serverApiKey))
            throw new SecurityException("Invalid API key");

        List<NoteChainTx> list = txRepo.findByStatusOrderByCreatedAtAsc(TxStatus.pending);
        if (limit > 0 && list.size() > limit)
            return list.subList(0, limit);
        return list;
    }
}
