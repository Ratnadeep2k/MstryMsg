'use client'

import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User'
import React, { useState } from 'react'

function dashboard() {
  const [messages,setMessages] = useState<Message[]>([])
  const [loading,setIsLoading] = useState(false);
  const {toast} = useToast()
  return (
    <div>page</div>
  )
}

export default dashboard