"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"
//@ts-ignore
import { Music } from "lucide-react"

export function Appbar() {
    const session = useSession();

    return <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 justify-between">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold text-foreground">Vybe</span>
        </div>
        <div>
            {session.data?.user && <Button variant="outline" className="border-border text-foreground hover:bg-primary/20 hover:text-primary" onClick={() => signOut()}>Logout</Button>}
            {!session.data?.user && <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => signIn()}>Signin</Button>}
        </div>
    </div>
}