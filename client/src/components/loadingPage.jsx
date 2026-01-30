import React from 'react'
import spinner from '../assets/spinner.png'
import file from '../assets/file.png'
import bgImg from '../assets/bg_img.png'

const loadingPage = ({fileName}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6"
    style={{ 
      fontFamily: "'Montserrat', 'Roboto', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      backgroundImage: `url(${bgImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
        <div className="max-w-md w-full bg-white/45 backdrop-blur-sm rounded-3xl shadow-xl p-10 text-center"> 
           <div className="flex justify-center mb-6">
             <img
               src={spinner}
               alt="loading"
            className="w-16 h-16 animate-spin-slow opacity-90"
             />
           </div>

          <h2 className="text-2xl font-semibold text-slate-900 mb-3 bg-gradient-to-r from-[#6D5DF6] to-[#1C2A4A] bg-clip-text text-transparent">
            Processing your document...
          </h2>

          <p className="text-slate-600 text-sm mb-8 bg-gradient-to-r from-[#6D5DF6] to-[#1C2A4A] bg-clip-text text-transparent">
            Hang tight! We’re analyzing and indexing your file.
          </p>

          <div className="flex items-center gap-3 bg-slate-100/70 p-4 rounded-xl max-w-sm mx-auto">
            <img src={file} alt="file" className="w-10 h-10" />
            <div className="text-left">
            <p className="text-slate-800 font-medium text-sm truncate max-w-[200px]">
              {fileName}
            </p>
            <p className="text-slate-500 text-xs">Uploading & indexing...</p>
            </div>
          </div>
        
        
        </div>
    </div>
  )
}

export default loadingPage