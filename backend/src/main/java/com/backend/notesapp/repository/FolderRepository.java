package com.backend.notesapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.notesapp.models.Folder;

public interface FolderRepository extends JpaRepository<Folder, Integer> {}
