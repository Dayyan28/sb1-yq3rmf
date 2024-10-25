"use client"

import { useEcommerceStore } from '@/hooks/useEcommerceStore'
import React from 'react'

export function TransactionLogs() {
  const { logs } = useEcommerceStore()

  return (
    <section className="p-4 bg-white mt-8">
      <h2 className="text-2xl font-bold mb-4 text-[#1A3A3A]">Transaction Logs</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-[#1A3A3A]">Requests</h3>
          <div className="bg-[#F5F5F5] p-4 rounded-md h-64 overflow-y-auto">
            {logs.filter(log => log.type === 'request').map((log, index) => (
              <div key={index} className="mb-2">
                <p className="text-sm text-[#4A6363]">{log.timestamp.toLocaleString()}</p>
                <pre className="text-sm text-[#1A3A3A] whitespace-pre-wrap">{log.content}</pre>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-[#1A3A3A]">Responses</h3>
          <div className="bg-[#F5F5F5] p-4 rounded-md h-64 overflow-y-auto">
            {logs.filter(log => log.type === 'response').map((log, index) => (
              <div key={index} className="mb-2">
                <p className="text-sm text-[#4A6363]">{log.timestamp.toLocaleString()}</p>
                <pre className="text-sm text-[#1A3A3A] whitespace-pre-wrap">{log.content}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}