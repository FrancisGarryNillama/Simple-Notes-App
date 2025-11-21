package com.backend.notesapp.service;

import org.springframework.stereotype.Service;
import com.backend.notesapp.repository.NoteRepository;
import com.backend.notesapp.repository.FolderRepository;
import com.backend.notesapp.models.Note;
import com.backend.notesapp.models.Folder;
import com.backend.notesapp.dto.NoteRequest;
import com.backend.notesapp.exception.ResourceNotFoundException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepo;
    private final FolderRepository folderRepo;

    public NoteService(NoteRepository noteRepo, FolderRepository folderRepo) {
        this.noteRepo = noteRepo;
        this.folderRepo = folderRepo;
    }

    public List<Note> getNotesByFolder(Integer folderId) {
        return noteRepo.findByFolderId(folderId);
    }

    public Note getById(Integer id) {
        return noteRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found with ID: " + id));
    }

    public Note create(NoteRequest req) {
        Folder folder = folderRepo.findById(req.getFolderId())
                .orElseThrow(() -> new ResourceNotFoundException("Folder not found"));

        Note note = new Note();
        note.setFolder(folder);
        note.setTitle(req.getTitle());
        note.setDescription(req.getDescription());  // FIXED
        note.setColor(req.getColor());
        note.setLastSaved(LocalDateTime.now());

        return noteRepo.save(note);
    }

    public Note update(Integer id, NoteRequest req) {
        Note existing = noteRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));

        if (req.getTitle() != null)
            existing.setTitle(req.getTitle());

        if (req.getDescription() != null)
            existing.setDescription(req.getDescription()); // FIXED

        if (req.getColor() != null)
            existing.setColor(req.getColor());

        existing.setLastSaved(LocalDateTime.now());

        return noteRepo.save(existing);
    }

    public void delete(Integer id) {
        noteRepo.deleteById(id);
    }
}
