"use client"
import StreamView from '../components/StreamView'


const REFRESH_INTERVAL_MS = 10 * 1000;

const creatorId = "6df488bd-3f06-4390-b4f3-64dfefed389c"

export default function Component() {
  
    return <StreamView creatorId={creatorId} playVideo={true} />
}