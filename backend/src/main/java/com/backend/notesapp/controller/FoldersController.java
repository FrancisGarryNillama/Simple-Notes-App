package com.backend.notesapp.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.backend.notesapp.models.Folder;
import com.backend.notesapp.service.FolderService;

@RestController
@RequestMapping("/api/folders")
@CrossOrigin(origins = "http://localhost:3000")
public class FoldersController {
    private final FolderService folderService;
    public FoldersController(FolderService fs){ this.folderService = fs; }

    @GetMapping
    public List<Folder> list(){ return folderService.getAll(); }

    @PostMapping
    public Folder create(@RequestBody Folder folder){ return folderService.create(folder); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id){ folderService.delete(id); }
}
