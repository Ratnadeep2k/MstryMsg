'use client'

import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { APIResource } from 'openai/resource.mjs';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

function dashboard() {
  const [messages,setMessages] = useState<Message[]>([])
  const [loading,setIsLoading] = useState(false);
  const [isSwitchLoading,setIswitchLoading] = useState(false)
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
  const fetchAcceptMessage = useCallback(async()=>{
    setIsLoading(true)
    try {
       const response = await axios.get('/api/accept-messages')
       setValue('acceptMessages ',response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title : 'Failed to fetch accept messages',
        description : axiosError.response?.data.message || axiosError.message || 'Failed to accept msg',
        variant :"destructive"
      })
       
    }
    finally{
    setIswitchLoading(false);
    }





  },[setValue])

  const fetchMessages = useCallback( async(refresh:boolean = false)=>{
    setIsLoading(true)
    setIswitchLoading(false)
    try{
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if(refresh){
        toast({
          title : 'Refreshed Messages',
          description : 'Showing latest Messages',
        }
        )
      }
    }
    catch(error){
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title : 'Failed to fetch messages',
        description : axiosError.response?.data.message || axiosError.message || 'Failed to fetch msg',
        variant :"destructive"
      })

    }
    finally{
      setIsLoading(false)
      setIswitchLoading(false)
    }
   
  },[setIsLoading,setMessages])

  useEffect(()=>{
    if(!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  },[session,setValue,fetchAcceptMessage,fetchMessages])
  //handle switch change 
  const handleSwitchChange = async()=>{
    try {
       const response = await axios.post<ApiResponse>('/api/accept-messages',
        {
          acceptMessages:!acceptMessages
        });
       setValue('acceptMessages',!acceptMessages)
        toast({
          title : response.data.message,
          variant : 'default'
        })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title : 'Failed to update accept messages',
        description : axiosError.response?.data.message || axiosError.message || 'Failed to update msg',
        variant :"destructive"
      })
      
    }
  }


  return (
    <div>page</div>
  )
}

export default dashboard