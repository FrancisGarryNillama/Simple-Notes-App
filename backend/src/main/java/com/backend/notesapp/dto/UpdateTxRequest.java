package com.backend.notesapp.dto;

import lombok.Data;

@Data
public class UpdateTxRequest {
    private String tx_hash;
    private String status;
    private Integer block_height;
}
