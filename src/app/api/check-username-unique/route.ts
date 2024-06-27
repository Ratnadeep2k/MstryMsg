import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod';
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request : Request){
    await dbConnect()

    try {
        const {searchParams} =new URL(request.url)
        const queryParam = {
            username: searchParams.get("username")
        }

        //validation with Zod
       const result = UsernameQuerySchema.safeParse(queryParam)
       console.log(result) //Remove at the end 
       if(!result.success){
         const UsernameErrors = result.error.format().username?._errors || []
         return Response.json({
                success: false,
                message: "Invalid username",
                errors: UsernameErrors
            },
            {
                status: 400
            
         })
       }

       const {username} = result.data
       

        
    } catch (error) {
        console.error("Error checking username",error)
        return Response.json({
            success: false,
            message: "Error checking username"
        },
        {
            status: 500
        }
    )
    }
}