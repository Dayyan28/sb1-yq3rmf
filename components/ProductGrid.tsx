"use client"

import Image from 'next/image'
import { Plus, HelpCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEcommerceStore } from '@/hooks/useEcommerceStore'

interface ProductGridProps {
  onCustomProduct: () => void
}

export function ProductGrid({ onCustomProduct }: ProductGridProps) {
  const { productList, addToOrder } = useEcommerceStore()

  return (
    <div className="lg:w-1/2">
      <h2 className="text-xl font-bold mb-4 text-[#1A3A3A]">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {productList.map((product) => (
          <Card key={product.id} className="flex flex-col justify-between bg-white">
            <CardContent className="p-4">
              <div className="w-full aspect-square relative mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#1A3A3A]">{product.name}</h3>
                {product.isCustom && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0">
                          <HelpCircle className="h-4 w-4 text-[#4A6363]" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Use this option to specify a custom SKU for testing specific discounts with wiCodes.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              {!product.isCustom && (
                <p className="text-sm text-[#4A6363]">{product.price}</p>
              )}
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                onClick={() => product.isCustom ? onCustomProduct() : addToOrder(product)} 
                className="w-full bg-[#FF6B4A] hover:bg-[#FF6B4A]/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {product.isCustom ? 'Add Custom' : 'Add'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}