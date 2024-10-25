"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatCurrency } from '@/lib/data'
import React from 'react'

interface TransactionHandlerProps {
  autoFinalise: string
  total: number
  onTransactionComplete: () => void
  wiCode: string
  onClose: () => void
}

export default function TransactionHandler({
  autoFinalise,
  total,
  onTransactionComplete,
  wiCode,
  onClose,
}: TransactionHandlerProps) {
  const [status, setStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending')
  const [transactionId, setTransactionId] = useState('')

  const handleInitiateTransaction = async () => {
    try {
      setStatus('processing')
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setTransactionId('TXN' + Date.now())
      setStatus('success')
      
      if (autoFinalise === 'yes') {
        handleFinaliseTransaction()
      }
    } catch (error) {
      setStatus('error')
    }
  }

  const handleFinaliseTransaction = async () => {
    try {
      setStatus('processing')
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onTransactionComplete()
    } catch (error) {
      setStatus('error')
    }
  }

  const handleReverseTransaction = async () => {
    try {
      setStatus('processing')
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onClose()
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader>
          <CardTitle className="text-[#1A3A3A]">Transaction Handler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-[#4A6363]">Total Amount:</div>
            <div className="text-[#1A3A3A] font-semibold">{formatCurrency(total)}</div>
            {wiCode && (
              <>
                <div className="text-[#4A6363]">wiCode:</div>
                <div className="text-[#1A3A3A]">{wiCode}</div>
              </>
            )}
            {transactionId && (
              <>
                <div className="text-[#4A6363]">Transaction ID:</div>
                <div className="text-[#1A3A3A]">{transactionId}</div>
              </>
            )}
          </div>

          {status === 'error' && (
            <Alert variant="destructive">
              <AlertDescription>
                An error occurred while processing the transaction.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2 pt-4">
            {status === 'pending' && (
              <Button
                onClick={handleInitiateTransaction}
                className="bg-[#73B4BC] hover:bg-[#73B4BC]/90 text-white"
              >
                Initiate Transaction
              </Button>
            )}

            {status === 'success' && autoFinalise === 'no' && (
              <>
                <Button
                  onClick={handleFinaliseTransaction}
                  className="bg-[#73B4BC] hover:bg-[#73B4BC]/90 text-white"
                >
                  Finalise Transaction
                </Button>
                <Button
                  onClick={handleReverseTransaction}
                  variant="outline"
                  className="border-[#FF6B4A] text-[#FF6B4A] hover:bg-[#FF6B4A]/10"
                >
                  Reverse Transaction
                </Button>
              </>
            )}

            {status !== 'processing' && (
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-[#4A6363] hover:text-[#1A3A3A]"
              >
                Close
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}