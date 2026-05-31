"use client"
import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
//@ts-ignore
import { ThumbsUp, Play, Share2, Music } from "lucide-react"
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'
//@ts-ignore
import YouTubePlayer from 'youtube-player';
import { Appbar } from './Appbar'
import { toast } from 'sonner'
import { YT_REGEX } from '../lib/utils'
import axios from "axios"

interface Video {
    "id": string,
    "type": string,
    "url": string,
    "extractedId": string,
    "title": string,
    "smallImg": string,
    "bigImg": string,
    "active": boolean,
    "userId": string,
    "upvotes": number,
    "haveUpvoted": boolean
}

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function StreamView({
    creatorId,
    playVideo = false
}: {
    creatorId: string;
    playVideo: boolean;
}) {
  const [inputLink, setInputLink] = useState('')
  const [queue, setQueue] = useState<Video[]>([])
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(false);
  const [playNextLoader, setPlayNextLoader] = useState(false);
  const [votingId, setVotingId] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
// @ts-ignore
  const videoPlayerRef = useRef<HTMLDivElement>();

  async function refreshStreams() {
    try {
      const res = await axios(`/api/streams/?creatorId=${creatorId}`);
      const json = res.data;
      setQueue(json.streams.map((s: any) => ({
          ...s,
          haveUpvoted: s.voted ?? s.haveUpvoted ?? false
      })).sort((a: any, b: any) => a.upvotes < b.upvotes ? 1 : -1));
      
      setCurrentVideo(video => {
          if (video?.id === json.activeStream?.stream?.id) {
              return video;
          }
          return json.activeStream.stream
      });
    } catch(e: any) {
      if (e?.response?.status === 403) {
        toast.error("You are not logged in. Please sign in to continue.", {
          position: "bottom-center",
        });
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }
  }

  useEffect(() => {
    refreshStreams();
    intervalRef.current = setInterval(() => {
        refreshStreams();
    }, REFRESH_INTERVAL_MS)
    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [])

  useEffect(() => {
    if (!videoPlayerRef.current) {
        return;
    }
    let player = YouTubePlayer(videoPlayerRef.current);
    
    // 'loadVideoById' is queued until the player is ready to receive API calls.
    player.loadVideoById(currentVideo?.extractedId);
    
    // 'playVideo' is queue until the player is ready to received API calls and after 'loadVideoById' has been called.
    player.playVideo();
    function eventHandler(event: any) {
        console.log(event);
        console.log(event.data);
        if (event.data === 0) {
            playNext();
        }
    };
    player.on('stateChange', eventHandler);
    return () => {
        player.destroy();
    }
  }, [currentVideo, videoPlayerRef])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/streams/", {
        method: "POST",
        body: JSON.stringify({
            creatorId,
            url: inputLink
        })
    });
    setQueue([...queue, await res.json()])
    setLoading(false);
    setInputLink('')
  }

  const handleVote = async (id: string, isUpvote: boolean) => {
    if (votingId) return;
    setVotingId(id);
    setQueue(queue.map(video => 
      video.id === id 
        ? { 
            ...video, 
            upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1,
            haveUpvoted: !video.haveUpvoted
          } 
        : video
    ).sort((a, b) => (b.upvotes) - (a.upvotes)))

    try {
      await fetch(`/api/streams/${isUpvote ? "upvote" : "downvote"}`, {
          method: "POST",
          body: JSON.stringify({
              streamId: id
          })
      })
    } catch(e) {
      console.error(e)
    }
    setVotingId(null);
  }

  const playNext = async () => {
    if (queue.length > 0) {
        try {
            setPlayNextLoader(true)
            const data = await fetch('/api/streams/next', {
                method: "GET",
            })
            const json = await data.json();
            setCurrentVideo(json.stream)
            setQueue(q => q.filter(x => x.id !== json.stream?.id))
        } catch(e) {

        }
        setPlayNextLoader(false)
    }
  }

  const handleShare = () => {
    const shareableLink = `${window.location.host}/creator/${creatorId}`
    navigator.clipboard.writeText(shareableLink)
    toast.success("Link copied", { 
      position: "bottom-center",
    })
  }

  return (
    <main className="min-h-screen bg-background">
        {/* Header */}
        <header className="px-6 py-6 border-b border-border">
            <div className="container mx-auto max-w-5xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Appbar />
                </div>
                <Button 
                    onClick={handleShare}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground flex gap-2"
                >
                    <Share2 className="h-4 w-4" />
                    Share
                </Button>
            </div>
        </header>

        <div className="container mx-auto px-6 py-8 max-w-5xl">

            {/* Now Playing Section */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Now Playing</h2>
                {currentVideo ? (
                    <Card className="bg-card border-border p-8">
                        <div className="flex gap-6 items-start">
                            {playVideo ? (
                                <div className="w-full">
                                    {/* @ts-ignore */}
                                    <div ref={videoPlayerRef} className="w-full" />
                                </div>
                            ) : (
                                <>
                                    <div className="shrink-0 w-32 h-32 bg-card rounded overflow-hidden">
                                        <img
                                            src={currentVideo.bigImg}
                                            alt={currentVideo.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="grow">
                                        <h3 className="text-2xl font-bold text-foreground mb-4">{currentVideo.title}</h3>
                                    </div>
                                </>
                            )}
                        </div>
                        {playVideo && (
                            <Button
                                onClick={playNext}
                                disabled={playNextLoader}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-6"
                                size="lg"
                            >
                                <Play className="mr-2 h-4 w-4" />
                                {playNextLoader ? "Loading..." : "Play Next"}
                            </Button>
                        )}
                    </Card>
                ) : (
                    <Card className="bg-card border-border p-12 text-center">
                        <p className="text-muted-foreground text-lg">No video playing</p>
                    </Card>
                )}
            </section>

            {/* Add Song Section */}
            <section className="mb-8">
                <div className="space-y-3">
                    <Input
                        type="text"
                        placeholder="Paste YouTube link here"
                        value={inputLink}
                        onChange={(e) => setInputLink(e.target.value)}
                        className="w-full bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <Button 
                        disabled={loading} 
                        onClick={handleSubmit} 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
                    >
                        {loading ? "Adding..." : "Add to Queue"}
                    </Button>
                </div>

                {inputLink && inputLink.match(YT_REGEX) && !loading && (
                    <Card className="bg-card border-border mt-4 p-4">
                        <LiteYouTubeEmbed title="" id={inputLink.split("?v=")[1]} />
                    </Card>
                )}
            </section>

            {/* Upcoming Songs Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">Upcoming Songs</h2>
                {queue.length === 0 ? (
                    <Card className="bg-card border-border p-8 text-center">
                        <p className="text-muted-foreground">Queue is empty. Add songs to get started!</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {queue.map((video) => (
                            <Card
                                key={video.id}
                                className="bg-card border-border p-4 hover:border-primary/50 transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Thumbnail */}
                                    <div className="shrink-0 w-24 h-24 bg-card rounded overflow-hidden">
                                        <img
                                            src={video.smallImg || video.bigImg}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Stream Info and Votes */}
                                    <div className="grow">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-lg font-semibold text-foreground">{video.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={votingId === video.id}
                                                onClick={() => handleVote(video.id, video.haveUpvoted ? false : true)}
                                                className={`border-border ${video.haveUpvoted ? 'bg-primary/20 text-primary' : 'hover:bg-primary/20 hover:text-primary'}`}
                                            >
                                                <ThumbsUp className="h-4 w-4 mr-1" />
                                                {video.upvotes}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

        </div>
    </main>
  )
}