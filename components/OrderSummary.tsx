'use client'

import Image from 'next/image'
import { ChevronDown, ChevronUp, Trash2, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useEcommerceStore } from '@/hooks/useEcommerceStore.context'
import { formatCurrency } from '@/lib/data'
import React from 'react'

interface OrderSummaryProps {
  autoFinalise: string
  setAutoFinalise: (value: string) => void
  onProceedToPayment: () => void
}

export function OrderSummary({
  autoFinalise,
  setAutoFinalise,
  onProceedToPayment,
}: OrderSummaryProps) {
  const {
    order,
    wiCode,
    discounts,
    error,
    updateQuantity,
    deleteProduct,
    calculateDiscountedTotal,
    applyWiCode,
    removeDiscount,
    setWiCode,
  } = useEcommerceStore()

  console.log('order: ', order)

  return (
    <div className="lg:w-1/2 lg:mt-10">
      <Card className="w-full pb-0 bg-white">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#1A3A3A]">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-[#4A6363]">
                  <span className="w-1/2">Product</span>
                  <span className="w-1/4 text-right">Price</span>
                  <span className="w-1/4 text-center">QTY</span>
                </div>
                <Separator className="bg-[#E0E0E0]" />

                {order.length === 0 ? (
                  <div className="text-[#4A6363] text-center py-8">Your cart is empty</div>
                ) : (
                  order.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm items-center">
                      <div className="flex items-center w-1/2">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="rounded-md mr-2"
                        />
                        <span className="text-[#1A3A3A]">{item.name}</span>
                      </div>
                      <div className="w-1/4 text-right">
                        <span
                          className={
                            item.discountedPrice ? 'line-through text-[#4A6363]' : 'text-[#1A3A3A]'
                          }
                        >
                          {formatCurrency(item.price)}
                        </span>
                        {item.discountedPrice && (
                          <span className="text-[#FF6B4A] block">
                            {formatCurrency(item.discountedPrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center w-1/4 justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-[#4A6363]"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <span className="mx-2 text-[#1A3A3A]">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-[#4A6363]"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-2 text-[#FF6B4A]"
                          onClick={() => deleteProduct(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                <Separator className="bg-[#E0E0E0]" />
                <div className="flex justify-between font-bold text-[#1A3A3A]">
                  <span>Total</span>
                  <span>{formatCurrency(calculateDiscountedTotal())}</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#1A3A3A]">Payment Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="wicode" className="text-[#1A3A3A]">
                    Do you have a wiCode?
                  </Label>
                  <div className="flex mt-2.5">
                    <Input
                      id="wicode"
                      placeholder="Enter wiCode"
                      value={wiCode}
                      onChange={(e) => setWiCode(e.target.value)}
                      className="rounded-r-none flex-grow border-[#E0E0E0]"
                    />
                    <Button
                      className="rounded-l-none bg-[#FF6B4A] hover:bg-[#FF6B4A]/90 text-white"
                      onClick={applyWiCode}
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Error {error.code}</AlertTitle>
                    <AlertDescription>{error.description}</AlertDescription>
                  </Alert>
                )}

                {discounts.map((discount, index) => (
                  <div key={index} className="bg-[#E8F3F3] p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-[#1A3A3A]">wiCode: {discount.wiCode}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDiscount(discount.wiCode)}
                        className="text-[#FF6B4A] hover:text-[#FF6B4A] hover:bg-[#E8F3F3] hover:bg-opacity-70"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="text-[#4A6363]">
                      Discount: {formatCurrency(discount.amount)}
                    </div>
                    <div className="text-[#4A6363]">
                      Product SKU: {discount.appliedTo.join(', ')}
                    </div>
                    <div className="text-[#4A6363]">Transaction ID: {discount.transactionId}</div>
                  </div>
                ))}

                <div>
                  <Label className="text-[#1A3A3A]">Auto Finalise</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-4 w-4 ml-2 text-[#4A6363]"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" align="start" className="max-w-[200px]">
                        <p>
                          When set to "Yes", the process payment will initiate the transaction
                          request and the advice request, closing off the sale as successful. When
                          set to "No", it allows you to pause a transaction in mid-flight and gives
                          you the option to Finalise or Reverse a transaction.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <RadioGroup
                    value={autoFinalise}
                    onValueChange={setAutoFinalise}
                    className="flex gap-4 mt-1.5"
                  >
                    <div className="flex items-center">
                      <RadioGroupItem value="yes" id="auto-finalise-yes" />
                      <Label htmlFor="auto-finalise-yes" className="ml-2 text-[#1A3A3A]">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="no" id="auto-finalise-no" />
                      <Label htmlFor="auto-finalise-no" className="ml-2 text-[#1A3A3A]">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                  <div className="mt-6">
                    <Button
                      className="w-full bg-[#73B4BC] hover:bg-[#73B4BC]/90 text-white"
                      size="lg"
                      onClick={onProceedToPayment}
                    >
                      Process Payment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
