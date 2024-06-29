import { Message } from './../../../model/User';
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
    //Aggrigation pipeline mongodb
     const user  = await UserModel.aggregate([
       {
          $match :{id:userId},
        
       },
       {
        $unwind :'$messages'
       }, 
       {
            $sort :{'messages.createdAt':-1}
       },
       {
        $group :{_id:'$_id',messages:{$push:'$messages'}}
       }

     ])
     if(!user || user.length === 0){
        return {
            status: 404,
            body: { error: 'No user found' }
        }
     }
      return Response.json({

        success : true,
        message : user[0].messages
      },
      {
        status : 200,
      }
    
    )
    
   } catch (error) {
    
   }

}