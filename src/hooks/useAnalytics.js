import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useAnalytics() {
  const [data, setData] = useState({
    totalProducts: 0,
    totalInquiries: 0,
    newInquiries: 0,
    responseRate: 0,
    inquiriesByMonth: [],
    topProducts: [],
    inquiriesByStatus: [],
    recentInquiries: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)

      const [
        { count: totalProducts },
        { count: totalInquiries },
        { count: newInquiries },
        { data: allInquiries },
        { data: productCounts },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('inquiries').select('id, status, created_at, customer_name, email, products(name)').order('created_at', { ascending: false }).limit(100),
        supabase.from('inquiries').select('product_id, products(name)').not('product_id', 'is', null),
      ])

      const responded = (allInquiries || []).filter(i => i.status !== 'pending').length
      const responseRate = totalInquiries > 0
        ? Math.round((responded / totalInquiries) * 100)
        : 0

      // Group inquiries by month (last 6 months)
      const monthCounts = {}
      const now = new Date()
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
        monthCounts[key] = 0
      }
      ;(allInquiries || []).forEach(inq => {
        const d = new Date(inq.created_at)
        const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' })
        if (key in monthCounts) monthCounts[key]++
      })
      const inquiriesByMonth = Object.entries(monthCounts).map(([month, count]) => ({ month, count }))

      // Status breakdown
      const statusMap = {}
      ;(allInquiries || []).forEach(inq => {
        statusMap[inq.status] = (statusMap[inq.status] || 0) + 1
      })
      const inquiriesByStatus = Object.entries(statusMap).map(([status, count]) => ({ status, count }))

      // Top products
      const productMap = {}
      ;(productCounts || []).forEach(inq => {
        const name = inq.products?.name || 'Unknown'
        productMap[name] = (productMap[name] || 0) + 1
      })
      const topProducts = Object.entries(productMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }))

      setData({
        totalProducts: totalProducts || 0,
        totalInquiries: totalInquiries || 0,
        newInquiries: newInquiries || 0,
        responseRate,
        inquiriesByMonth,
        topProducts,
        inquiriesByStatus,
        recentInquiries: (allInquiries || []).slice(0, 5),
      })
      setLoading(false)
    }

    fetchAll()
  }, [])

  return { data, loading }
}
