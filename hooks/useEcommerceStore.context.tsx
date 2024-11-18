'use client'

import { createContext, useContext, useState } from 'react'
import { Product, Discount, Log } from '@/types'
import { products } from '@/lib/data'

interface StoreTrxDetails {
  basketId: string
  cashierId: string
  posId: string
  storeId: string
  trxId: string
}

type EcommerceStoreContextType = {
  productList: Product[]
  order: Product[]
  wiCode: string
  discounts: Discount[]
  error: any
  logs: Log[]
  addToOrder: (product: Product) => void
  updateQuantity: (id: number, amount: number) => void
  deleteProduct: (id: number) => void
  calculateDiscountedTotal: () => number
  calculateTotalDiscount: () => number
  applyWiCode: () => void
  removeDiscount: (wiCode: string) => void
  setWiCode: (wiCode: string) => void
  storeTrxDetails: StoreTrxDetails
  sendTransactionAdvice: (wiTrxId: string) => void
}

export const EcommerceStoreContext = createContext<EcommerceStoreContextType | null>(null)

export const useEcommerceStore = () => {
  const context = useContext(EcommerceStoreContext)
  if (!context) {
    throw new Error('useEcommerceStore must be used within an EcommerceStoreProvider')
  }
  return context
}

export function ECommerceStoreProvider({ children }: { children: React.ReactNode }) {
  const [productList] = useState(products)
  const [order, setOrder] = useState<Product[]>([])
  const [wiCode, setWiCode] = useState('')
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [error, setError] = useState<any>(null)
  const [logs, setLogs] = useState<Log[]>([])
  const [storeTrxDetails, setStoreTrxDetails] = useState<StoreTrxDetails>({
    basketId: '',
    cashierId: `CASHIER_${Math.random().toString(36).substr(2, 9)}`, // Random cashier ID
    posId: '1',
    storeId: 'TEST_STORE',
    trxId: '0',
  })

  const addToOrder = (product: Product) => {
    setOrder((prevOrder) => {
      const existingProduct = prevOrder.find((item) => item.id === product.id)
      if (existingProduct) {
        return prevOrder.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                price: (item.quantity + 1) * item.pricePerUnit,
              }
            : item
        )
      }

      return [...prevOrder, { ...product, quantity: 1, price: product.pricePerUnit }]
    })
  }

  const updateQuantity = (id: number, amount: number) => {
    setOrder((prevOrder) =>
      prevOrder.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + amount),
              price: Math.max(1, item.quantity + amount) * item.pricePerUnit,
            }
          : item
      )
    )
  }

  const deleteProduct = (id: number) => {
    setOrder((prevOrder) => prevOrder.filter((item) => item.id !== id))
  }

  const calculateDiscountedTotal = () => {
    return order.reduce(
      (sum, item) => sum + (item.discountedPrice || item.price) * item.quantity,
      0
    )
  }

  const calculateTotalDiscount = () => {
    return discounts.reduce((sum, discount) => sum + discount.amount, 0)
  }

  const generateNewTrxId = () => {
    setStoreTrxDetails((prev) => ({
      ...prev,
      trxId: (parseInt(prev.trxId) + 1).toString(),
      basketId: `BASKET_${Date.now()}`,
    }))
  }

  const applyWiCode = async () => {
    setError(null)
    try {
      if (discounts.length === 0) {
        generateNewTrxId()
      }

      const requestPayload = {
        apiCredentials: {
          apiId: 'WIPOS',
          apiPassword: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
          apiClientVersion: '1.14',
          apiServerVersion: '1.14',
        },
        basketAmount: calculateDiscountedTotal(),
        billAmount: calculateDiscountedTotal(),
        storeTrxDetails: storeTrxDetails,
        token: {
          id: wiCode,
          type: 'WICODE',
        },
        type: 'PAYMENT',
      }

      const requestLog: Log = {
        type: 'request',
        content: JSON.stringify(requestPayload),
        timestamp: new Date(),
      }
      setLogs((prevLogs) => [...prevLogs, requestLog])

      const response = await fetch('/api/transaction-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      })

      const data = await response.json()
      const responseLog: Log = {
        type: 'response',
        content: JSON.stringify(data),
        timestamp: new Date(),
      }
      setLogs((prevLogs) => [...prevLogs, responseLog])

      if (data.vsp && data.vsp.length > 0) {
        const vspResponse = data.vsp[0]
        if (vspResponse.responseCode !== '00') {
          setError({
            code: vspResponse.responseCode,
            description: vspResponse.responseDesc,
          })
          return
        }
      }

      if (data.totalAmountProcessed > 0) {
        const discount = {
          wiCode,
          amount: data.totalAmountProcessed,
          appliedTo: order.map((item) => item.id.toString()),
          transactionId: data.transactionId,
        }
        setDiscounts([...discounts, discount])

        // Update product prices based on the discount
        const discountPerItem = data.totalAmountProcessed / order.length
        setOrder((prevOrder) =>
          prevOrder.map((item) => ({
            ...item,
            discountedPrice: item.price - discountPerItem,
          }))
        )
      }
    } catch (error: any) {
      setError({
        code: 'TRANSACTION_ERROR',
        description: 'Failed to process transaction',
      })
    }
  }

  const sendTransactionAdvice = async (wiTrxId: string) => {
    try {
      const advicePayload = {
        apiCredentials: {
          apiId: 'WIPOS',
          apiPassword: 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3',
          apiClientVersion: '1.14',
          apiServerVersion: '1.14',
        },
        action: 'FINALISE',
        originalTrx: {
          storeTrxDetails: storeTrxDetails,
          type: 'PAYMENT',
          wiTrxId: wiTrxId,
        },
      }

      // Make the advice call...
      // Add to logs...
    } catch (error) {
      setError({
        code: 'ADVICE_ERROR',
        description: 'Failed to send transaction advice',
      })
    }
  }

  const updateProductPrices = (discount: Discount) => {
    setOrder((prevOrder) =>
      prevOrder.map((item) => {
        if (discount.appliedTo.includes(item.sku!)) {
          return { ...item, discountedPrice: item.price - discount.amount / item.quantity }
        }
        return item
      })
    )
  }

  const removeDiscount = (wiCode: string) => {
    setDiscounts((prevDiscounts) => prevDiscounts.filter((discount) => discount.wiCode !== wiCode))
    setOrder((prevOrder) => prevOrder.map((item) => ({ ...item, discountedPrice: undefined })))
  }

  return (
    <EcommerceStoreContext.Provider
      value={{
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
        storeTrxDetails,
        sendTransactionAdvice,
      }}
    >
      {children}
    </EcommerceStoreContext.Provider>
  )
}
