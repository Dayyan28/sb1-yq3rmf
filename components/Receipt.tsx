"use client"

import Image from 'next/image'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from '@/lib/data'
import { Product } from '@/types'

interface ReceiptProps {
  order: Product[]
  total: number
  discount: number
  onClose: () => void
}

export default function Receipt({
  order,
  total,
  discount,
  onClose,
}: ReceiptProps) {
  const subtotal = total + discount

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1A3A3A]">Receipt</h2>
              <p className="text-sm text-[#4A6363]">
                {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-[#4A6363] hover:text-[#1A3A3A]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {order.map((item) => (
                <div key={item.id} className="flex items-start space-x-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="rounded-md"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-[#1A3A3A]">{item.name}</h3>
                      <p className="text-[#1A3A3A]">
                        {formatCurrency(item.discountedPrice || item.price)}
                      </p>
                    </div>
                    <div className="flex justify-between text-sm text-[#4A6363]">
                      <p>Qty: {item.quantity}</p>
                      <p>{formatCurrency((item.discountedPrice || item.price) * item.quantity)}</p>
                    </div>
                    {item.discountedPrice && (
                      <p className="text-sm text-[#FF6B4A]">
                        Saved: {formatCurrency((item.price - item.discountedPrice) * item.quantity)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-6 space-y-2">
            <Separator className="bg-[#E0E0E0]" />
            <div className="flex justify-between text-[#4A6363]">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#FF6B4A]">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
            <Separator className="bg-[#E0E0E0]" />
            <div className="flex justify-between font-bold text-lg text-[#1A3A3A]">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-[#4A6363]">
            <p>Thank you for shopping with us!</p>
            <p>Your order has been processed successfully.</p>
          </div>
        </div>
      </div>
    </div>
  )
}