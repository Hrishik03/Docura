import React from 'react'
import upload from '../assets/upload.png'
import file from '../assets/file.png'
import bgImg from '../assets/bg_img.png'

const landingPage = ({onUploadClick}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6"
    style={{ 
      fontFamily: "'Montserrat', 'Roboto', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      backgroundImage: `url(${bgImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
        <div className="max-w-3xl w-full bg-white/45 backdrop-blur-sm rounded-3xl shadow-xl p-10 text-center">
        <div className="flex justify-center mb-6">
          <img src={file} alt="logo" className="w-20 h-20 drop-shadow-md" />
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-[#6D5DF6] to-[#1C2A4A] bg-clip-text text-transparent">
          Chat with Any Document
        </h1>

        <p className="text-lg text-slate-600 max-w-xl mx-auto mb-10 bg-gradient-to-r from-[#6D5DF6] to-[#1C2A4A] bg-clip-text text-transparent">
        Chat with your documents and get answers in seconds, Upload PDFs, DOCX, or TXT files up to 50MB each
        </p>

        <button
          onClick={onUploadClick}
          className="
            bg-gradient-to-r from-indigo-500 to-blue-400 
            text-white font-medium text-lg px-8 py-3 rounded-full 
            shadow-xl hover:scale-[1.02] active:scale-[0.98] 
            transition flex items-center gap-3 mx-auto
            cursor-pointer
          "
        >
          <img src={upload} alt="upload" className="w-6 h-6" />
          Upload Document to Start
        </button>
        </div>
    </div>
  )
}

export default landingPage