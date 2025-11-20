package com.backend.notesapp.dto;

import lombok.Data;

@Data
public class NoteRequest {
    private Integer folderId;
    private String title;
    private String content;
    // getters & setters
}
