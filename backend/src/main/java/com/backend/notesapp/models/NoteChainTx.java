package com.backend.notesapp.models;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Data
@Entity
@Table(name = "note_chain_tx")
public class NoteChainTx {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "note_id", nullable = false)
    private Integer noteId;

    @Column(name = "user_id")
    private Integer userId;   // until you add real auth

    @Column(name = "tx_hash", nullable = false, unique = true, length = 64)
    private String txHash;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('pending','confirmed','failed')", nullable = false)
    private TxStatus status = TxStatus.pending;

    private Double amount;

    private String currency;

    @Column(columnDefinition = "json")
    private String metadata;  // stored as JSON string

    @Column(name = "external_ref")
    private String externalRef;

    @Column(name = "block_height")
    private Integer blockHeight;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
