package com.backend.notesapp.dto;

import lombok.Data;

@Data
public class NoteRequest {
    private String title;
    private String description; // <-- matches frontend
    private String color;
    private Integer folderId;   // <-- required
}
