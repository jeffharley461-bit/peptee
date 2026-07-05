import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function ImageUploader({ value, onChange, bucket = 'product-images' }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]     = useState(value || null)
  const inputRef = useRef()

  const handleFile = async (file) => {
    if (!file) return
    setUploading(true)
    try {
      const filename = `${Date.now()}_${file.name.replace(/\s/g, '_')}`
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filename, file, { contentType: file.type, upsert: false })
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filename)
      setPreview(publicUrl)
      onChange(publicUrl)
    } catch (err) {
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  const clear = () => { setPreview(null); onChange(null) }

  return (
    <div>
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
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
              <PhotoIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Drag & drop image here, or <span className="text-primary font-medium">click to select</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 5MB</p>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  )
}
