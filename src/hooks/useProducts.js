import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const filtersKey = JSON.stringify(filters)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase
        .from('products')
        .select('*, categories(id, name)')

      if (filters.category) query = query.eq('category_id', filters.category)
      if (filters.search)   query = query.ilike('name', `%${filters.search}%`)
      if (filters.minPrice) query = query.gte('price_usd', filters.minPrice)
      if (filters.maxPrice) query = query.lte('price_usd', filters.maxPrice)

      const sortField = filters.sortBy || 'created_at'
      const ascending = filters.sortDir !== 'desc'
      query = query.order(sortField, { ascending })

      const { data, error } = await query
      if (error) throw error
      setProducts(data ?? [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  return { products, loading, error, refetch: fetchProducts }
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    supabase
      .from('products')
      .select('*, categories(id, name)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setProduct(data)
        setLoading(false)
      })
  }, [id])

  return { product, loading, error }
}
