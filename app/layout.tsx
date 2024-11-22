import { ECommerceStoreProvider } from '@/hooks/useEcommerceStore.context'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Yoyo Online Store',
  description: 'A modern e-commerce experience',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <ECommerceStoreProvider>
        <body className={inter.className}>{children}</body>
      </ECommerceStoreProvider>
    </html>
  )
}
