package com.backend.notesapp.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.backend.notesapp.models.Note;
import com.backend.notesapp.dto.NoteRequest;
import com.backend.notesapp.service.NoteService;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:3000")
public class NotesController {
    private final NoteService noteService;
    public NotesController(NoteService ns){ this.noteService = ns; }

    @GetMapping
    public List<Note> getByFolder(@RequestParam Integer folderId){
        return noteService.getNotesByFolder(folderId);
    }

    @GetMapping("/{id}")
    public Note getOne(@PathVariable Integer id) { /* optional */ return noteService.getById(id); }

    @PostMapping
    public Note create(@RequestBody NoteRequest req){ return noteService.create(req); }

    @PutMapping("/{id}")
    public Note update(@PathVariable Integer id, @RequestBody NoteRequest req){ return noteService.update(id, req); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id){ noteService.delete(id); }
}
