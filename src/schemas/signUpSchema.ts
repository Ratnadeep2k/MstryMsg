import {z} from 'zod'

export const usernameValidation  = z
        .string()
        .min(2,"username must be atleast two characters")
        .max(20,"username must be atmost 20 characters")
        .regex(/^[a-zA-Z0-9_]*$/,"username must contain only alphanumeric characters and underscore")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message :"Invalid Email address"}),
    password: z.string().min(6,{message:"Invalid password , password must be 6 char"})
})