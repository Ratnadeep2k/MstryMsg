import { useToast } from '@/components/ui/use-toast'
import { signUpSchema } from '@/schemas/signUpSchema'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
//[] fro dynmaic data props
export const VerifyAccount= () => {
    const router =useRouter()
    const params = useParams<{username:string}>()
    const {toast} = useToast()

    const form = useForm< Zod.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
       
      })

      const onSubmit = async(data : z.infer<typeof verifySchema>)=>{

        try {
           const response = await axios.post(`/api/verify-code`,{

                username : params.username,
                code:data.code
            }
                
            )
            toast({
                title : "Success",
                description:response.data.message
            })
            router.replace('sign-in')
        } catch (error) {
            console.error("Error in Verify", error)
                const axiosError = error as AxiosError<ApiResponse>
                let errorMessage = axiosError.response?.data.message
          
                toast({
                  title: 'Verify Failed',
                  description: errorMessage,
                  variant: 'destructive'
            })
            
        }
      }

  return (
    <div className=''></div>
  )
}
