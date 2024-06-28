import { acceptMessageSchema } from './../../../schemas/acceptMessageSchema';
import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"; //usefull 
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from 'mongoose';

export async function GET(request : Request){
    await dbConnect()
    const session =  await getServerSession(authOptions) // currently login user
    const user = session?.user as User //user has all data  collecting from session
    if (!session || !session.user) {
        return {
            status: 401,
            body: { error: 'Not authorized' }
        }
    }
   const userId = new mongoose.Types.ObjectId(user._id);
   try {
     const user  = await UserModel.aggregate([
       {
          $match :{id:userId},
        
       },
       {
        $unwind :'$messages'
       },
       {
            $sort :{'messages.createdAt':-1}
       }

     ])
    
   } catch (error) {
    
   }

}