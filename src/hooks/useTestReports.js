import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useTestReports(filters = {}) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filtersKey = JSON.stringify(filters)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase.from('test_reports').select('*')

      if (filters.publishedOnly) query = query.eq('is_published', true)
      if (filters.productId)     query = query.eq('product_id', filters.productId)
      if (filters.search) {
        const term = filters.search.replace(/[%,]/g, '')
        query = query.or(`product_name.ilike.%${term}%,batch_number.ilike.%${term}%`)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error } = await query
      if (error) throw error
      setReports(data ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey])

  useEffect(() => { fetchReports() }, [fetchReports])

  return { reports, loading, error, refetch: fetchReports }
}
