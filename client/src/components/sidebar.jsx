import React from 'react'

const sidebar = ({ documents, activeDoc, onSelectDoc, onLogout }) => {
  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col">
        {/* Header */}
      <div className="p-4 text-lg font-semibold border-b border-slate-700">
        Documents
      </div>

       {/* Documents list */}
       <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {documents.length === 0 && (
          <p className="text-slate-400 text-sm px-2">
            No documents uploaded
          </p>
        )}

        {documents.map((doc) => {
          const isActive = activeDoc?.id === doc.id;

          return (
            <button
              key={doc.id}
              onClick={() => onSelectDoc(doc)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition
                ${
                  isActive
                    ? "bg-slate-700"
                    : "hover:bg-slate-800"
                }`}
            >
              {doc.file_name}
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-md text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default sidebar