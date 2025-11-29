package com.backend.notesapp.controller;

import com.backend.notesapp.dto.CreateTxRequest;
import com.backend.notesapp.dto.UpdateTxRequest;
import com.backend.notesapp.service.ChainService;
import com.backend.notesapp.models.NoteChainTx;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/chain")
public class ChainController {

    private final ChainService chainService;

    public ChainController(ChainService chainService) {
        this.chainService = chainService;
    }

    // POST /api/chain/tx
    @PostMapping("/tx")
    public Map<String, Object> create(@RequestBody CreateTxRequest req) throws Exception {

        Integer userId = 1; // TODO: replace with auth system

        NoteChainTx tx = chainService.createTx(req, userId);

        return Map.of(
                "success", true,
                "id", tx.getId(),
                "tx_hash", tx.getTxHash()
        );
    }

    // GET /api/chain/txs?noteId=#
    @GetMapping("/txs")
    public Map<String, Object> getTxs(@RequestParam Integer noteId) {
        List<NoteChainTx> list = chainService.getTxsByNote(noteId);

        return Map.of(
                "success", true,
                "transactions", list
        );
    }

    // POST /api/chain/tx/update (internal)
    @PostMapping("/tx/update")
    public Map<String, Object> update(
            @RequestHeader("X-API-KEY") String key,
            @RequestBody UpdateTxRequest req
    ) throws Exception {

        NoteChainTx tx = chainService.updateTx(req, key);

        return Map.of("success", true, "tx_hash", tx.getTxHash());
    }

    // GET /api/chain/pending
    @GetMapping("/pending")
    public Map<String, Object> getPending(
            @RequestHeader("X-API-KEY") String key,
            @RequestParam(defaultValue = "50") Integer limit
    ) {

        return Map.of(
                "success", true,
                "pending", chainService.getPending(limit, key)
        );
    }
}
