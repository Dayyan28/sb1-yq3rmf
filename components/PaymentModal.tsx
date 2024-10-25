"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency } from '@/lib/data'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: () => void
  total: number
}

export default function PaymentModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  total,
}: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      onPaymentSuccess()
      onClose()
    } catch (error) {
      // Handle error
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#1A3A3A]">Payment Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center mb-4">
            <div className="text-sm text-[#4A6363]">Total Amount</div>
            <div className="text-2xl font-bold text-[#1A3A3A]">
              {formatCurrency(total)}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber" className="text-[#1A3A3A]">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="border-[#E0E0E0]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-[#1A3A3A]">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="border-[#E0E0E0]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv" className="text-[#1A3A3A]">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="border-[#E0E0E0]"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button
              type="submit"
              disabled={processing}
              className="bg-[#73B4BC] hover:bg-[#73B4BC]/90 text-white"
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              className="text-[#4A6363] hover:text-[#1A3A3A]"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}