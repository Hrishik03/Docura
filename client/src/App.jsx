import React, { useState } from "react";
import LandingPage from "./components/landingPage";
import LoadingPage from "./components/loadingPage";
import ChatPage from "./components/chatPage";
import AuthPage from "./components/authPage";
import { supabase } from "./supabase";

const App = () => {
  const [screen, setScreen] = useState("auth"); // auth | landing | processing | chat
  const [user, setUser] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [docId, setDocId] = useState(null);

  //  after login/signup
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setScreen("landing");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSelectedFile(null);
    setDocId(null);
    setScreen("auth");
  };

  const handleHome = () => {
    setScreen("landing");
    setSelectedFile(null);
    setDocId(null);
  };

  const handleUploadClick = () => {
    const picker = document.createElement("input");
    picker.type = "file";
    picker.accept = ".pdf,.doc,.docx,.txt";

    picker.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setSelectedFile(file);
      setScreen("processing");

      try {
        const formData = new FormData();
        formData.append("file", file);

        const API_BASE = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_BASE}/upload`, { 
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

        const data = await res.json();
        setDocId(data.doc_id);
        setScreen("chat");
      } catch (err) {
        console.error(err);
        alert("Upload failed");
        setScreen("landing");
      }
    };

    picker.click();
  };

  // AUTH
  if (screen === "auth") {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // LANDING
  if (screen === "landing") {
    return (
      <LandingPage
        onUploadClick={handleUploadClick}
        onLogout={handleLogout}
        user={user}
      />
    );
  }

  // PROCESSING
  if (screen === "processing" && selectedFile) {
    return <LoadingPage fileName={selectedFile.name} />;
  }

  // CHAT
  if (screen === "chat" && selectedFile) {
    return (
      <ChatPage
        fileName={selectedFile.name}
        docId={docId}
        onLogout={handleLogout}
        onHome={handleHome}
      />
    );
  }

  return null;
};

export default App;
