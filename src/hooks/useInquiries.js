import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useInquiries(filters = {}) {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filtersKey = JSON.stringify(filters)

  const fetchInquiries = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('inquiries')
        .select('*, products(id, name)')
        .order('created_at', { ascending: false })

      if (filters.status && filters.status !== 'all')
        query = query.eq('status', filters.status)
      if (filters.search)
        query = query.or(
          `customer_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        )
      if (filters.dateFrom)
        query = query.gte('created_at', filters.dateFrom)
      if (filters.dateTo)
        query = query.lte('created_at', filters.dateTo + 'T23:59:59')

      const { data, error } = await query
      if (error) throw error
      setInquiries(data ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey])

  useEffect(() => { fetchInquiries() }, [fetchInquiries])

  const updateInquiry = async (id, updates) => {
    const { error } = await supabase
      .from('inquiries')
      .update(updates)
      .eq('id', id)
    if (!error) fetchInquiries()
    return { error }
  }

  const deleteInquiry = async (id) => {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id)
    if (!error) fetchInquiries()
    return { error }
  }

  return { inquiries, loading, error, refetch: fetchInquiries, updateInquiry, deleteInquiry }
}
