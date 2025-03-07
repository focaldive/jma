"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function DonorForm() {
    const [isAnonymous, setIsAnonymous] = useState(false)

    return (
        <Card className="shadow-md border-2 border-primary/10">
            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-lg capitalize">Donor Information</h2>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="anonymous"
                                checked={isAnonymous}
                                onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                            />
                            <Label htmlFor="anonymous" className="text-sm cursor-pointer">
                                Donate anonymously
                            </Label>
                        </div>
                    </div>

                    {!isAnonymous && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input placeholder="First Name" />
                                <Input placeholder="Last Name" />
                            </div>
                            <Input type="email" placeholder="Email" />
                            <Input placeholder="Phone" />
                            <Input placeholder="Contact Address" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Select defaultValue="select">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="select">Select Country</SelectItem>
                                        <SelectItem value="us">United States</SelectItem>
                                        <SelectItem value="ca">Canada</SelectItem>
                                        <SelectItem value="uk">United Kingdom</SelectItem>
                                        <SelectItem value="au">Australia</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input placeholder="Region/State" />
                            </div>
                        </div>
                    )}

                    <div className="flex items-start space-x-2 pt-2">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms" className="text-sm">
                            I accept the{" "}
                            <Button variant="link" className="h-auto p-0">
                                terms and conditions
                            </Button>
                        </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                        <Checkbox id="updates" defaultChecked />
                        <Label htmlFor="updates" className="text-sm">
                            Keep me updated about how my donation is making an impact
                        </Label>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

