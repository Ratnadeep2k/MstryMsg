'use client'

import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

function dashboard() {
  const [messages,setMessages] = useState<Message[]>([])
  const [loading,setIsLoading] = useState(false);
  const {toast} = useToast()
  //optimistic UI

  const handleDeleteMessage = (messageId : string)=>{
    setMessages(messages.filter((message)=>message._id!==messageId))
  }
  const {data: session} = useSession()
  const form = useForm({
    resolver:zodResolver(acceptMessageSchema)
  })

  const {register,watch,setValue} = form; 
  const acceptMessages = watch('acceptMessages')
  
  return (
    <div>page</div>
  )
}

export default dashboard