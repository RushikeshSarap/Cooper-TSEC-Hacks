"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router"; // Updated import from 'react-router-dom' to 'react-router' based on App.tsx
import { Chatbot } from "@/components/chatbot";
import { UserAvatar } from "@/components/user-avatar";
import { ArrowLeft } from "lucide-react";
import api from "@/services/api";

export default function ChatbotPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Basic auth check reused from Dashboard logic
        const fetchUser = async () => {
            try {
                const res = await api.get("/auth/me");
                setUser(res.data.user);
            } catch (error) {
                console.error("Auth check failed:", error);
                navigate("/login");
            }
        };
        fetchUser();
    }, [navigate]);

    if (!user) return null; // Or a loading spinner

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />
                <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[100px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 rounded-xl hover:bg-secondary transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </button>
                        <span className="font-bold text-lg text-foreground">AI Assistant</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <UserAvatar name={user.name} size="sm" />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        Where to next, {user.name.split(" ")[0]}?
                    </h1>
                    <p className="text-muted-foreground">
                        Let our AI help you plan your next group adventure.
                    </p>
                </div>
                <Chatbot />
            </main>
        </div>
    );
}
