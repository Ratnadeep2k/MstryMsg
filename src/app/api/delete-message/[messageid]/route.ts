import { Message } from '../../../../model/User';
import { acceptMessageSchema } from '../../../../schemas/acceptMessageSchema';
import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"; //usefull 
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from 'mongoose';

export async function DELETE(request : Request,{params}:{params:{messageid:string}}){
    const messageId = params.messageid
    await dbConnect()
    const session =  await getServerSession(authOptions) // currently login user
    const user = session?.user as User //user has all data  collecting from session
    if (!session || !session.user) {
        return {
            status: 401,
            body: { error: 'Not authorized' }
        }
    }

    try{
      const updateResult=await UserModel.updateOne(
        {_id:user._id},
        {$pull:{messages:{_id:messageId}}}
      )
      if(updateResult.modifiedCount == 0 ){
        return Response.json({
          success:false,
          message:"Message not found"
        },{
          status:404
        }
      )
      }
      return Response.json({
        success:true,
        message:"Message deleted successfully"
      },{
        status:200
    }
  )
}

  catch{
    return Response.json({
      success:false,
      message:"Unexpected error occured"
    },{
      status:500
    }
  )

  }

}