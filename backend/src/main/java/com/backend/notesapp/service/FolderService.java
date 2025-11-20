package com.backend.notesapp.service;

import org.springframework.stereotype.Service;
import com.backend.notesapp.repository.FolderRepository;
import com.backend.notesapp.models.Folder;
import java.util.List;

@Service
public class FolderService {
    private final FolderRepository folderRepo;
    public FolderService(FolderRepository folderRepo) { this.folderRepo = folderRepo; }

    public List<Folder> getAll() { return folderRepo.findAll(); }
    public Folder create(Folder f) { return folderRepo.save(f); }
    public void delete(Integer id) { folderRepo.deleteById(id); }
}
