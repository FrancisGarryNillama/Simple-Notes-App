package com.backend.notesapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.notesapp.models.Note;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Integer> {

    List<Note> findByFolderId(Integer folderId);   // <-- needed for /api/notes?folderId=123
}
