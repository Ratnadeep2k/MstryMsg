import { acceptMessageSchema } from './../../../schemas/acceptMessageSchema';
import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"; //usefull 
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request :Request){
    await dbConnect()
    const session =  await getServerSession(authOptions) // currently login user
    const user = session?.user as User //user has all data  collecting from session
    if (!session || !session.user) {
        return {
            status: 401,
            body: { error: 'Not authorized' }
        }
    }
   const userId = user._id;
   const {acceptMessages}=await request.json()
   try {
    const updatedUser =  await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessages:acceptMessages
            },
            {new : true}
     )
     if (!updatedUser) {
          return Response.json({
            success :false,
                message : "failed to update user status to accept messages"
          },
          {
                status : 500
          }
        )

        
     }
     return Response.json({
        success : true ,
        message : "successfully updated user status to accept messages",
        updatedUser
        },
        {
            status : 200
        }
    )
   } catch (error) {
         console.log("failed to update user status to accept messsage ",error)
         return Response.json({
            success :false,
                message : "failed to update user status to accept messages"
         },
         {status : 500}
        )
    
   }

} 