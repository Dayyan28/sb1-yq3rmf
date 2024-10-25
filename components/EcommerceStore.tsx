"use client"

import { useState } from 'react'
import { ProductGrid } from './ProductGrid'
import { OrderSummary } from './OrderSummary'
import { TransactionLogs } from './TransactionLogs'
import { CustomProductDialog } from './CustomProductDialog'
import { useEcommerceStore } from '@/hooks/useEcommerceStore'
import TransactionHandler from './TransactionHandler'
import PaymentModal from './PaymentModal'
import Receipt from './Receipt'

export default function EcommerceStore() {
  const {
    order,
    discounts,
    calculateDiscountedTotal,
    calculateTotalDiscount,
  } = useEcommerceStore()

  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [showTransactionHandler, setShowTransactionHandler] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [autoFinalise, setAutoFinalise] = useState('yes')

  const handleTransactionComplete = () => {
    setShowTransactionHandler(false)
    setShowReceipt(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] font-['Inter']">
      <header className="bg-[#001923] shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#FF6B4A]">Yoyo Online Store</h1>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col lg:flex-row p-4 gap-6">
        <ProductGrid onCustomProduct={() => setIsCustomDialogOpen(true)} />
        <OrderSummary 
          autoFinalise={autoFinalise}
          setAutoFinalise={setAutoFinalise}
          onProceedToPayment={() => setShowTransactionHandler(true)}
        />
      </main>
      
      <TransactionLogs />

      <CustomProductDialog 
        open={isCustomDialogOpen} 
        onOpenChange={setIsCustomDialogOpen} 
      />

      {showTransactionHandler && (
        <TransactionHandler
          autoFinalise={autoFinalise}
          total={calculateDiscountedTotal()}
          onTransactionComplete={handleTransactionComplete}
          wiCode={discounts.map(d => d.wiCode).join(',')}
          onClose={() => setShowTransactionHandler(false)}
        />
      )}

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={() => {}}
        total={calculateDiscountedTotal()}
      />

      {showReceipt && (
        <Receipt
          order={order}
          total={calculateDiscountedTotal()}
          discount={calculateTotalDiscount()}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  )
}