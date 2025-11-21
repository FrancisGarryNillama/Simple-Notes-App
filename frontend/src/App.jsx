import React, { useState } from "react";
import FoldersPage from "./pages/FoldersPage";
import NotesPage from "./pages/NotesPage";

export default function App() {
  const [currentView, setCurrentView] = useState("folders");
  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleSelectFolder = (folderId, folderName) => {
    setSelectedFolder({ id: folderId, name: folderName });
    setCurrentView("notes");
  };

  const handleBackToFolders = () => {
    setCurrentView("folders");
    setSelectedFolder(null);
  };

  return (
    <>
      {currentView === "folders" ? (
        <FoldersPage onSelectFolder={handleSelectFolder} />
      ) : (
        <NotesPage
          folderId={selectedFolder?.id}
          folderName={selectedFolder?.name}
          onBack={handleBackToFolders}
        />
      )}
    </>
  );
}