import React from 'react'

function DiagnosticPanel() {
  return (
    <div className="glass-card p-4">
      <h3 className="text-white font-semibold mb-2">Diagnostics</h3>
      <div className="space-y-2 text-sm">
        <div className="text-white/80">
          <span className="font-medium">Extension Status:</span> Active
        </div>
        <div className="text-white/80">
          <span className="font-medium">AI Service:</span> Placeholder Mode
        </div>
        <div className="text-white/80">
          <span className="font-medium">Storage:</span> Local Chrome Storage
        </div>
        <div className="text-white/80">
          <span className="font-medium">Sync:</span> Offline Mode
        </div>
      </div>
    </div>
  )
}

export { DiagnosticPanel }
export default DiagnosticPanel
