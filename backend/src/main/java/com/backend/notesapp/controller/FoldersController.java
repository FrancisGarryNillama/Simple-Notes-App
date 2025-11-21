package com.backend.notesapp.controller;

import com.backend.notesapp.dto.FolderRequest;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.backend.notesapp.models.Folder;
import com.backend.notesapp.service.FolderService;

@RestController
@RequestMapping("/api/folders")
public class FoldersController {
    private final FolderService folderService;
    public FoldersController(FolderService fs){ this.folderService = fs; }

    @GetMapping
    public List<Folder> list(){ return folderService.getAll(); }

    @PostMapping
    public Folder create(@RequestBody FolderRequest folderRequest) {
        Folder folder = new Folder();
        folder.setName(folderRequest.getName());
        return folderService.create(folder);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id){ folderService.delete(id); }
}
