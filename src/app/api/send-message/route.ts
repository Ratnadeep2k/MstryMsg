import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";
export async function POST(request :Request){
    await dbConnect()
    const {username ,content} = await request.json()
    try {
       const user = await UserModel.findOne({username})
       if(!user){
              return {
                status : 404,
                body : {error : 'No user found'}
              }
       }
       //is user accepting the messages 
         if(!user.isAcceptingMessage){
          return {
                status : 403,
                body : {error : 'User is not accepting messages'}
             }
         }

         const newMessage ={content, createdAt:new Date()}
         user.messages.push(newMessage as Message)
         await user.save()
         return Response.json({
            success : true,
            message : "Message sent successfully"
          },
          {
            status : 200,
          
         })
       
    } catch (error) {
        console.log("Error sending message",error)
        return Response.json({
            success : false,
            message : "Internal error"
          },
          {
            status : 500,
        })
        
    }
}