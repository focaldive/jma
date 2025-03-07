import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface DonationInfoProps {
    donationType: string
}

export function DonationInfo({ donationType }: DonationInfoProps) {
    return (
        <Card className="shadow-md border-2 border-primary/10">
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-lg">YOU ARE DONATING TO:</h2>
                        {donationType === "live" && (
                            <Badge variant="destructive" className="animate-pulse">
                                LIVE
                            </Badge>
                        )}
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Jaffna Muslim Fund for Education and Community Development</h3>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{donationType === "live" ? "68%" : "92%"} Funded</span>
                            </div>
                            <Progress value={donationType === "live" ? 68 : 92} className="h-2" />
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold">Goal: $100,000</p>
                            <p className="text-sm font-medium text-muted-foreground">
                                Raised: ${donationType === "live" ? "68,000" : "92,000"}
                            </p>
                        </div>

                        {donationType === "live" && (
                            <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                                <p className="text-sm text-amber-800">
                                    This is an urgent appeal. Your immediate support can make a critical difference.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

