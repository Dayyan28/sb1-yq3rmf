export interface Product {
  id: number
  name: string
  price: number
  image: string
  sku?: string
  quantity: number
  pricePerUnit: number
  isCustom?: boolean
  discountedPrice?: number
}

export interface Discount {
  wiCode: string
  amount: number
  appliedTo: string[]
  transactionId: string
}

export interface Log {
  type: 'request' | 'response'
  content: string
  timestamp: Date
}