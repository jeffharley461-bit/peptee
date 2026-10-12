import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { DocumentPlusIcon, XMarkIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'

export default function FileUploader({ value, onChange, bucket = 'test-reports', accept = 'application/pdf' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef()

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('application/')) {
      setError('Please upload a document file (PDF).')
      return
    }
    setError(null)
    setUploading(true)
    try {
      const filename = `${Date.now()}_${file.name.replace(/\s/g, '_')}`
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filename, file, { contentType: file.type, upsert: false })
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filename)
      onChange(publicUrl)
    } catch (err) {
      setError(err.message || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const clear = () => { onChange(null) }

  return (
    <div>
      {value ? (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <DocumentArrowDownIcon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {decodeURIComponent(value.split('/').pop()?.replace(/^\d+_/, '') || 'test-report.pdf')}
            </p>
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
              View file
            </a>
          </div>
          <button
            type="button"
            onClick={clear}
            className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
            aria-label="Remove file"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary dark:hover:border-primary hover:bg-primary/5 transition-colors"
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto" />
          ) : (
            <>
              <DocumentPlusIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Drag &amp; drop report PDF here, or <span className="text-primary font-medium">click to select</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF up to 10MB</p>
            </>
          )}
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  )
}