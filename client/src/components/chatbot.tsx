"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Sparkles } from "lucide-react";
import api from "@/services/api";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await api.post("agent", { prompt: input });
            const assistantMessage: Message = {
                role: "assistant",
                content: response.data.response,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error: any) {
            console.error("Chatbot error:", error);
            const errorMessage: Message = {
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Chat Messages */}
            <Card className="mb-4 p-6 min-h-[500px] max-h-[600px] overflow-y-auto bg-card/50 backdrop-blur-sm border-border/50">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <Sparkles className="w-12 h-12 mb-4 text-primary/50" />
                        <p className="text-lg font-medium mb-2">Start Planning Your Adventure</p>
                        <p className="text-sm">
                            Tell me about your destination, budget, group size, and duration!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${
                                    msg.role === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                        msg.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-secondary-foreground"
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                        {msg.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-secondary text-secondary-foreground rounded-2xl px-4 py-3">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Input Area */}
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your trip plans..."
                    disabled={loading}
                    className="flex-1 bg-background/80 backdrop-blur-sm border-border/50"
                />
                <Button
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    size="icon"
                    className="shrink-0"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4" />
                    )}
                </Button>
            </div>
        </div>
    );
}
