"use client"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
//@ts-ignore
import { Music, ThumbsUp, Play, Users, Share2, ArrowRight, Zap, Radio } from "lucide-react"
import Google from "next-auth/providers/google"

export default function Home() {
  const session = useSession()
  const router = useRouter()

  const handleGetStarted = () => {
    if (session.data?.user) {
      router.push("/dashboard")
    } else {
      signIn("google", { callbackUrl: "/dashboard" })
    }
  }

  return (
    <main className="min-h-screen bg-background overflow-hidden">

      {/* ── Navbar ── */}
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Music className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">Vybe</span>
          </div>
          <div className="flex items-center gap-3">
            {session.data?.user ? (
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign in
                </Button>
                <Button
                  onClick={handleGetStarted}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative py-24 md:py-36">
        {/* Glow effect behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl px-6 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="text-sm text-primary font-medium">Real-time collaborative music</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6">
              Let your fans{" "}
              <span className="text-primary">choose</span>{" "}
              the music
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Create a live song queue where your audience adds tracks, votes on favorites, 
              and the most popular song plays next. No more guessing what they want to hear.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Start for Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 px-8 py-6 text-lg"
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              >
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 border-t border-border/50">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Three simple steps to let your audience run the show
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Share2,
                step: "01",
                title: "Share your link",
                description: "Get a unique queue link and share it with your audience. Anyone with the link can add songs."
              },
              {
                icon: ThumbsUp,
                step: "02",
                title: "Fans vote",
                description: "Your audience adds YouTube tracks and upvotes their favorites. The queue sorts by popularity in real time."
              },
              {
                icon: Play,
                step: "03",
                title: "Top song plays",
                description: "Hit play and the most upvoted song starts automatically. When it ends, the next top song takes over."
              }
            ].map((item) => (
              <Card
                key={item.step}
                className="bg-card border-border p-8 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for creators
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Everything you need to run an interactive music session
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: ThumbsUp,
                title: "Democratic Voting",
                description: "One vote per user per song. No spam, no bots — just genuine audience picks rising to the top."
              },
              {
                icon: Radio,
                title: "Auto-Play Queue",
                description: "Songs play back-to-back automatically. When one ends, the next most-voted track starts instantly."
              },
              {
                icon: Users,
                title: "Real-Time Sync",
                description: "Queue updates every 10 seconds for all viewers. Everyone sees the same live state simultaneously."
              },
              {
                icon: Share2,
                title: "One-Click Sharing",
                description: "Copy your unique creator link and paste it anywhere — Discord, Twitch chat, socials. Fans join instantly."
              }
            ].map((feature) => (
              <Card
                key={feature.title}
                className="bg-card border-border p-8 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto max-w-6xl px-6">
          <Card className="bg-card border-border p-12 md:p-16 text-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-8">
                <Music className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to vybe?
              </h2>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-10">
                Set up your music queue in seconds. Free, no credit card required.
              </p>
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 py-6 text-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Vybe</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Let the crowd decide the beat.
          </p>
        </div>
      </footer>

    </main>
  )
}
