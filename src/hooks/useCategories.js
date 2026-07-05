import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('name')
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setCategories(data ?? [])
        setLoading(false)
      })
  }, [])

  return { categories, loading, error }
}
