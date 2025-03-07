import { Card, CardContent } from "@/components/ui/card"
import { Shield, Heart, Eye } from "lucide-react"

export function PromiseCard() {
    return (
        <Card className="shadow-md border-2 border-primary/10">
            <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Our Promise to You</h2>

                <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                            <h3 className="text-sm font-medium">Security & Trust</h3>
                            <p className="text-sm text-muted-foreground">
                                Your donation is secure and encrypted. We are a registered charity committed to transparency.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <Heart className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                            <h3 className="text-sm font-medium">Direct Impact</h3>
                            <p className="text-sm text-muted-foreground">
                                Every donation made to our registered charities will be utilized with utmost care to directly benefit
                                those in need.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <Eye className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                            <h3 className="text-sm font-medium">Transparency</h3>
                            <p className="text-sm text-muted-foreground">
                                We provide regular updates on how your donations are making a difference in the community.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

