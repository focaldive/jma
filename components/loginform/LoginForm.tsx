"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Invalid email or password")
        setLoading(false)
        return
      }

      // save session flag
      localStorage.setItem("loggedIn", "true")

      router.push("/admin")
    } catch (err) {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border border-gray-200 bg-white shadow-lg rounded-lg">
        <CardHeader className="text-center items-center">
          <Image
            src="/assets/logo.png"
            alt="Jaffna Muslim Assoc Logo"
            width={50}
            height={40}
            priority
            className=" py-1 "
          />
          <CardTitle className="text-2xl text-gray-900 mb-2">
            Login to your account
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your email below to login
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
             {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="email" className="text-gray-900">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white text-gray-900 placeholder-gray-400 border-gray-300"
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-gray-900">
                    Password
                  </FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white text-gray-900 placeholder-gray-400 border-gray-300"
                />

                <a
                  href="#"
                  className="ml-auto text-sm text-blue-600 hover:underline"
                >
                  Forgot your password?
                </a>
              </Field>

             

              <Field className="flex flex-col gap-2 ">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Field>

            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
