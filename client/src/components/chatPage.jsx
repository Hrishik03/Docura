import React, { useEffect, useRef, useState } from 'react'
import bot from "../assets/bot.png"
import user from "../assets/user.png"
import ReactMarkdown from "react-markdown";
import pdfIcon from "../assets/file-pdf.png";
import docIcon from "../assets/file-docx.png";
import txtIcon from "../assets/file-generic.png";
import fileIcon from "../assets/file.png";
import bgImg from "../assets/bg_img.png";

const UserMessage = ({ text }) => (
    <div className="flex justify-end">
      <div className="bg-indigo-500 text-white px-4 py-2 rounded-xl max-w-[70%]">
        {text}
      </div>
      <img src={user} alt="user" className="w-8 h-8 mt-1"/>   
    </div>
);

const BotMessage = ({ text }) => (
    <div className="flex items-start gap-2">
      <img src={bot} alt="bot" className="w-8 h-8 mt-1" />
      <div className="bg-white whitespace-pre-line text-slate-800 px-4 py-2 rounded-xl shadow-sm max-w-[70%] leading-relaxed">
       <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
);

const BotTyping = ({ botIcon }) => (
  <div className="flex items-start gap-2">
    <img src={botIcon} alt="bot" className="w-8 h-8 mt-1" />

    <div className="bg-white px-4 py-2 rounded-xl shadow-sm flex gap-1">
      <span className="typing-dot animate-bounce delay-0">•</span>
      <span className="typing-dot animate-bounce delay-100">•</span>
      <span className="typing-dot animate-bounce delay-200">•</span>
    </div>
  </div>
);

const chatPage = ({fileName, docId, onLogout, onHome}) => {

  const[messages,setMessages] = useState([]);
  const[input, setInput] = useState("");
  const[isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:"smooth"});
  },[messages]);

  const formatAnswer = (text) => {
    if (!text) return text;
  
    // Normalize literal \n to actual line breaks
    let cleaned = text.replace(/\\n/g, "\n").trim();
  
    // Break into lines for controlled cleanup
    let lines = cleaned
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0); // remove completely empty lines
  
    let result = [];
  
    for (let line of lines) {
  
      // Ignore orphan "*" lines 
      if (/^\*+$/.test(line)) {
        continue;
      }
  
      // Bullet: 
      if (/^\*\s+.+/.test(line)) {
        result.push("• " + line.replace(/^\*\s+/, ""));
        continue;
      }
  
      // Numbered list: "
      if (/^\d+[\.\)]\s+/.test(line)) {
        result.push(line.replace(/^(\d+)[\.\)]\s+/, "$1. "));
        continue;
      }
  
      // Section headings 
      if (/^[A-Za-z].*:\s*$/.test(line)) {
        result.push("\n" + line + "\n");
        continue;
      }
  
      // Normal paragraph
      result.push(line);
    }
  
    // Join, clean spacing
    let finalText = result.join("\n");
  
    // Remove double bullets
    finalText = finalText.replace(/\n{2,}/g, "\n\n");
  
    return finalText.trim();
  };
  

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
  
    // 1. Add user message
    const userMsg = { sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
  
    // 2. Show typing indicator
    setMessages((prev) => [...prev, { sender: "bot-typing" }]);
  
    try {
      const API_BASE = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_BASE}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          query: trimmed,
          doc_id: docId,
        }),
      });
  
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
      const data = await res.json();
  
      // 3. Remove typing indicator before real bot message arrives
      setMessages((prev) => prev.filter((msg) => msg.sender !== "bot-typing"));
  
      // 4. Add real bot answer
      const botMsg = {
        sender: "bot",
        text: formatAnswer(data.answer),
      };
  
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Error calling /query:", err);
  
      // remove typing indicator if present
      setMessages((prev) => prev.filter((msg) => msg.sender !== "bot-typing"));
  
      const errorMsg = {
        sender: "bot",
        text: "Sorry, something went wrong while talking to the document.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (fileName)=>{

    if(!fileName){
      return fileIcon;
    }

    const ext = fileName.split(".").pop().toLowerCase();

    switch(ext){
      case "pdf":
        return pdfIcon;
      case "doc":
      case "docx":
        return docIcon;
      case "txt":
        return txtIcon;
      default:
        return fileIcon;
    }
  };
  

  return (
    <div className="h-full w-full overflow-hidden"
    style={{ 
      fontFamily: "'Montserrat', 'Roboto', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      backgroundImage: `url(${bgImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="h-full w-full flex justify-center items-center p-6">
        <div className="w-full max-w-3xl h-[85vh] bg-white rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden">
          
          <div className="w-full bg-white p-4 flex items-center justify-between border-b border-slate-200">
            <div className="flex items-center gap-3">
              <img src={getFileIcon(fileName)} alt="file" className="w-8 h-8" />
              <h2 className="font-semibold text-slate-800 text-lg truncate">
                {fileName}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onLogout} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors duration-200 font-medium shadow-sm cursor-pointer">Logout</button>
              <button onClick={onHome} className="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors duration-200 font-medium shadow-sm cursor-pointer">Home</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-[#f6f7fb]" id="chat-scroll">
            {messages.map((msg, index) => {
              if (msg.sender === "user") {
                return <UserMessage key={index} text={msg.text} userIcon={user} />;
              }
              if (msg.sender === "bot") {
                return <BotMessage key={index} text={msg.text} botIcon={bot} />;
              }
              if (msg.sender === "bot-typing") {
                return <BotTyping key={index} botIcon={bot} />;
              }
              return null;
            })}
            <div ref={bottomRef} />
          </div>

          <div className="w-full bg-white p-4 flex items-center gap-3 border-t border-slate-200">
            <input 
              type="text" 
              placeholder="Ask something about this document..." 
              className="flex-1 bg-slate-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={input}
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading} 
              className="p-2 rounded-full hover:bg-indigo-100 transition"
            >
              <img src="/src/assets/send.png" alt="send" className="w-6 h-6" />
            </button>
          </div>

        </div>
        
      </div>
    </div>
  )
}

export default chatPage