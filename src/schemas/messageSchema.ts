
import {z} from 'zod'

export const msgSchema = z.object({
    content : z.string()
    .min(10,{message :'Content must be atleast of 10Char'})
    .max(300,{message:"Message must be atmost 300 char"})
})