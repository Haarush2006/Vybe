
import { authOptions } from "@/app/lib/authOptions";
import prisma from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"

const UpvoteSchema = z.object({
    streamId: z.string(),
})

export async function POST(req:NextRequest){

    const session = await getServerSession(authOptions)
    // @ts-ignore
    const user = session?.user

    if (!user) {
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 403
        })
    }



    try{
        const data = UpvoteSchema.parse(await req.json())
        await prisma.upvote.create({
            data:{
                // @ts-ignore
                userId: user.id,
                streamId: data.streamId
            }
        })

        return NextResponse.json({
            msg:"Done"
        })
    }
    catch(e){
        return NextResponse.json({
            msg:"Error while upvoting"
        },{
            status:403
        })
    }
}