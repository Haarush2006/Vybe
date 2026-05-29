
import { authOptions } from "@/app/lib/authOptions";
import prisma from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"

const DownvoteSchema = z.object({
    streamId: z.string(),
})

export async function POST(req:NextRequest){

    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!user) {
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 403
        })
    }

    try{
        const data = DownvoteSchema.parse(await req.json())
        await prisma.upvote.delete({
            where:{
                userId_streamId: {
                    // @ts-ignore
                    userId: user.id,
                    streamId: data.streamId
                }
            }
        })
        return NextResponse.json({
            msg:"Done"
        })
    }
    catch(e){
        return NextResponse.json({
            msg:"Error while removing vote"
        },{
            status:403  
        })
    }
}