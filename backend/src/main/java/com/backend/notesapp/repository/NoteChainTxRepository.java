package com.backend.notesapp.repository;

import com.backend.notesapp.models.TxStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.notesapp.models.NoteChainTx;

import java.util.List;
import java.util.Optional;

public interface NoteChainTxRepository extends JpaRepository<NoteChainTx, Integer> {

    List<NoteChainTx> findByNoteIdOrderByCreatedAtDesc(Integer noteId);

    Optional<NoteChainTx> findByTxHash(String txHash);

    List<NoteChainTx> findByStatusOrderByCreatedAtAsc(TxStatus status);

    // Additional methods for statistics
    long countByStatus(TxStatus status);

    List<NoteChainTx> findByUserId(Integer userId);
}