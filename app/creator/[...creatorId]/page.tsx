import StreamView from "@/app/components/StreamView";

export default async function Page({params}:{
    params: Promise<{
        creatorId: string
    }>
    
}) {
    const {creatorId} = await params
    console.log(creatorId)
    const cid = creatorId[0]
    return <div>
        <StreamView creatorId={cid} playVideo={false} />
    </div>
}



