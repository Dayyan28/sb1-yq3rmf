"use client"

import { useState } from 'react'
import { Product, Discount, Log } from '@/types'
import { products } from '@/lib/data'

export function useEcommerceStore() {
  const [productList] = useState(products)
  const [order, setOrder] = useState<Product[]>([])
  const [wiCode, setWiCode] = useState('')
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [error, setError] = useState<any>(null)
  const [logs, setLogs] = useState<Log[]>([])

  const addToOrder = (product: Product) => {
    setOrder(prevOrder => {
      const existingProduct = prevOrder.find(item => item.id === product.id)
      if (existingProduct) {
        return prevOrder.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, price: (item.quantity + 1) * item.pricePerUnit }
            : item
        )
      }
      return [...prevOrder, { ...product, quantity: 1, price: product.pricePerUnit }]
    })
  }

  const updateQuantity = (id: number, amount: number) => {
    setOrder(prevOrder =>
      prevOrder.map(item =>
        item.id === id
          ? { 
            ...item, 
            quantity: Math.max(1, item.quantity + amount),
            price: Math.max(1, item.quantity + amount) * item.pricePerUnit
          }
        : item
      )
    )
  }

  const deleteProduct = (id: number) => {
    setOrder(prevOrder => prevOrder.filter(item => item.id !== id))
  }

  const calculateDiscountedTotal = () => {
    return order.reduce((sum, item) => sum + (item.discountedPrice || item.price) * item.quantity, 0)
  }

  const calculateTotalDiscount = () => {
    return discounts.reduce((sum, discount) => sum + discount.amount, 0)
  }

  const applyWiCode = async () => {
    setError(null)
    try {
      const requestLog: Log = {
        type: 'request',
        content: JSON.stringify({ wiCode }),
        timestamp: new Date(),
      }
      setLogs(prevLogs => [...prevLogs, requestLog])

      const response = await fetch('/api/apply-wicode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wiCode }),
      })

      if (!response.ok) {
        throw new Error('Failed to apply wiCode')
      }

      const data = await response.json()
      const responseLog: Log = {
        type: 'response',
        content: JSON.stringify(data),
        timestamp: new Date(),
      }
      setLogs(prevLogs => [...prevLogs, responseLog])

      setDiscounts([...discounts, data])
      updateProductPrices(data)
    } catch (error: any) {
      setError({ code: 'WICODE_ERROR', description: 'Failed to apply wiCode' })
    }
  }

  const updateProductPrices = (discount: Discount) => {
    setOrder(prevOrder =>
      prevOrder.map(item => {
        if (discount.appliedTo.includes(item.sku!)) {
          return { ...item, discountedPrice: item.price - discount.amount / item.quantity }
        }
        return item
      })
    )
  }

  const removeDiscount = (wiCode: string) => {
    setDiscounts(prevDiscounts => prevDiscounts.filter(discount => discount.wiCode !== wiCode))
    setOrder(prevOrder => prevOrder.map(item => ({ ...item, discountedPrice: undefined })))
  }

  return {
    productList,
    order,
    wiCode,
    discounts,
    error,
    logs,
    addToOrder,
    updateQuantity,
    deleteProduct,
    calculateDiscountedTotal,
    calculateTotalDiscount,
    applyWiCode,
    removeDiscount,
    setWiCode,
  }
}