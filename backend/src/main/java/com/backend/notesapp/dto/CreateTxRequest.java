package com.backend.notesapp.dto;

import lombok.Data;
import java.util.Map;

@Data
public class CreateTxRequest {
    private Integer note_id;
    private String tx_hash;
    private Double amount;
    private String currency;
    private Map<String, Object> metadata;
    private String external_ref;
}
