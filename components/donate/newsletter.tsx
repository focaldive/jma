"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

export function NewsletterSignup() {
    const [email, setEmail] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (email) {
            // Here you would typically send the data to your API
            console.log("Subscribing:", { firstName, lastName, email })
            setIsSubmitted(true)
            // Reset form
            setEmail("")
            setFirstName("")
            setLastName("")
        }
    }

    return (
        <Card className="shadow-md border-2 border-primary/10">
            <CardContent className="p-6">
                <div className="space-y-4">
                    <h2 className="font-semibold text-lg">Stay Connected</h2>

                    {isSubmitted ? (
                        <Alert className="bg-green-50 border-green-200">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                            <AlertDescription className="text-green-800">
                                Thank you for subscribing! We&apos;ll keep you updated on our initiatives and impact.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-0 sm:flex sm:gap-4 items-start">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                                <Input placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                <Input placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            <div className="flex gap-4 flex-1">
                                <Input
                                    type="email"
                                    placeholder="Email address"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit">Subscribe</Button>
                            </div>
                        </form>
                    )}

                    <p className="text-xs text-muted-foreground">
                        By subscribing, you agree to receive updates from our organization. We respect your privacy and will never
                        share your information.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

