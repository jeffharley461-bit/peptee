import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useSettings() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single()
    if (error) setError(error.message)
    else setSettings(data)
    setLoading(false)
  }

  useEffect(() => { fetchSettings() }, [])

  const saveSettings = async (updates) => {
    if (!settings?.id) return { error: 'No settings record found' }
    const { data, error } = await supabase
      .from('settings')
      .update(updates)
      .eq('id', settings.id)
      .select()
      .single()
    if (!error) setSettings(data)
    return { data, error }
  }

  return { settings, loading, error, saveSettings, refetch: fetchSettings }
}
