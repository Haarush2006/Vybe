import youtubesearchapi from "youtube-search-api";
import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
const YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/


const CreateStreamSchema = z.object({
    creatorId : z.string(),
    url: z.string() 
})

const MAX_LEN = 20;



export async function GET(req:NextRequest){
    const creatorId = req.nextUrl.searchParams.get("creatorId")
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const user = session?.user

    if (!user) {
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 403
        })
    }

    if(!creatorId){
        return NextResponse.json({
            msg:"Creator Id is required"
        },{
            status:411
        })
    }

    const [streams, activeStream] = await Promise.all([prisma.stream.findMany({
        where:{
            userId: creatorId,
            played: false
        },
        include:{
            _count:{
                select: {
                    upvotes:true,
                }
            },
            upvotes:{
                where:{
                    // @ts-ignore
                    userId: user.id
                }
            }
        }
    }), prisma.currentStream.findFirst({
        where:{
            userId:creatorId
        },
        include:{
            stream: true
        }
    }) ])

    return NextResponse.json({
        // @ts-ignore
        streams: streams.map(({_count,...rest})=>({
            ...rest,
            upvotes: _count.upvotes,
            voted: rest.upvotes.length ? true : false
        })),
        activeStream
    })

}

export async function POST(req: NextRequest){
    try{
        const data = CreateStreamSchema.parse(await req.json())
        const isYt = data.url.match(YT_REGEX)

        if(!isYt){
            return NextResponse.json({
                msg:"incorrect url"
            },{
                status:411
            })
        }

        // Extract the video id from the regex capture group
        const extractedId = isYt[1]

        // Ensure the creator exists to avoid foreign-key constraint errors
        // const creator = await prisma.user.findUnique({ where: { id: data.creatorId } })
        // if(!creator){
        //     return NextResponse.json({
        //         msg: "Creator not found"
        //     },{
        //         status: 404
        //     })
        // }

        const VideoInfo = await youtubesearchapi.GetVideoDetails(extractedId)
        const thumbnails = VideoInfo.thumbnail.thumbnails
        thumbnails.sort((a: {width: Number},b: {width : Number})=> a.width< b.width ? -1 : 1)

        const existingActiveStream = await prisma.stream.count({
            where: {
                userId: data.creatorId
            }
        })

        if (existingActiveStream > MAX_LEN) {
            return NextResponse.json({
                message: "Already at limit"
            }, {
                status: 411
            })
        }
        const stream = await prisma.stream.create({
            data:{ 
                title: VideoInfo.title,
                userId: data.creatorId,
                url : data.url,
                type:"Youtube",
                extractedId,
                bigImg: thumbnails[thumbnails.length-1].url,
                smallImg:(thumbnails.length>1)? thumbnails[thumbnails.length-2].url: thumbnails[thumbnails.length-1].url,
                addedBy: data.creatorId
            }
                
        })

        return NextResponse.json({
            ...stream,
            hasUpvoted: false,
            upvotes: 0
        })

        
    } catch(e){
        console.log(e)
        return NextResponse.json({
            msg : "err while adding stream",
            err: e
        },{
            status: 411
        })
    }
}



