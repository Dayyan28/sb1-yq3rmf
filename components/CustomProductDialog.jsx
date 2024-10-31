"use client"

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEcommerceStore } from '@/hooks/useEcommerceStore'
import { Product } from '@/types'
import React from 'react'

interface CustomProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomProductDialog({ open, onOpenChange }: CustomProductDialogProps) {
  const { addToOrder } = useEcommerceStore()
  const [customProduct, setCustomProduct] = useState<Product>({
    id: 0,
    name: '',
    price: 0,
    image: '',
    sku: '',
    quantity: 1,
    pricePerUnit: 0,
  })

  const handleAddCustomProduct = () => {
    onOpenChange(false)
    addToOrder({ 
      ...customProduct, 
      id: Date.now(),
      image: 'https://via.placeholder.com/80x80/808080/FFFFFF?text=Custom'
    })
    setCustomProduct({
      id: 0,
      name: '',
      price: 0,
      image: '',
      sku: '',
      quantity: 1,
      pricePerUnit: 0,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#1A3A3A]">Add Custom Product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-[#1A3A3A]">Name</Label>
            <Input
              id="name"
              value={customProduct.name}
              onChange={(e) => setCustomProduct({...customProduct, name: e.target.value})}
              className="col-span-3 border-[#E0E0E0]"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sku" className="text-right text-[#1A3A3A]">SKU</Label>
            <Input
              id="sku"
              value={customProduct.sku}
              onChange={(e) => setCustomProduct({...customProduct, sku: e.target.value})}
              className="col-span-3 border-[#E0E0E0]"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right text-[#1A3A3A]">Quantity</Label>
            <div className="flex items-center col-span-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCustomProduct({
                  ...customProduct, 
                  quantity: Math.max(1, customProduct.quantity - 1)
                })}
                className="border-[#E0E0E0] text-[#4A6363]"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="quantity"
                type="number"
                value={customProduct.quantity}
                onChange={(e) => setCustomProduct({
                  ...customProduct, 
                  quantity: parseInt(e.target.value)
                })}
                className="w-20 mx-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-[#E0E0E0]"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCustomProduct({
                  ...customProduct, 
                  quantity: customProduct.quantity + 1
                })}
                className="border-[#E0E0E0] text-[#4A6363]"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pricePerUnit" className="text-right text-[#1A3A3A]">Price per Unit</Label>
            <Input
              id="pricePerUnit"
              type="number"
              value={customProduct.pricePerUnit || ''}
              onChange={(e) => setCustomProduct({
                ...customProduct, 
                pricePerUnit: parseFloat(e.target.value)
              })}
              className="col-span-3 border-[#E0E0E0]"
            />
          </div>
        </div>
        <Button 
          onClick={handleAddCustomProduct} 
          className="bg-[#FF6B4A] text-white hover:bg-[#FF6B4A]/90"
        >
          Add to Order
        </Button>
      </DialogContent>
    </Dialog>
  )
}