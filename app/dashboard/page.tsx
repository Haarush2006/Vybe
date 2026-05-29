"use client"
import StreamView from '../components/StreamView'


const REFRESH_INTERVAL_MS = 10 * 1000;

const creatorId = "60f35f53-4a49-46db-b2db-6444c763b8d2"

export default function Component() {
  
    return <StreamView creatorId={creatorId} playVideo={true} />
}