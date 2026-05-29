
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./db";



export const authOptions : AuthOptions= {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  secret:process.env.NEXTAUTH_SECRET,
  callbacks: {

    async signIn(params){
      console.log("fine")
      if(!params.user.email){
        return true
      }

        try{
          await prisma.user.create({
            data:{
              email:params.user.email,
              provider: "Google",
              name:params.user.name
            }
          })
        } catch {

        }
        return true
    },
      async jwt({account,user,token}){
        if(account && user) {
          token.id =  user.id
          token.email = user.email
        }
        return token
      },
      
      async session({session, token}){

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: token.email!
            }
          });

          if (user) {
            // @ts-ignore
            session.user!.id = user.id;
          }
        } catch (error) {
          console.log(error);
          throw error;
        }
        return session;
    },





  }
} 