package com.backend.notesapp.models;

import com.backend.notesapp.models.Folder;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "folder_id")
    private Folder folder;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "last_saved")
    private LocalDateTime lastSaved = LocalDateTime.now();
}
