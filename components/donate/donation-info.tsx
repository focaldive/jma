import { Card, CardContent } from "@/components/ui/card";

export function DonationInfo() {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-4">
                    <h2 className="font-semibold text-lg">YOU ARE DONATING TO:</h2>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">
                            Jaffna Muslim Fund for Education and Community Development
                        </h3>
                        <p className="text-sm text-muted-foreground">92% Funded</p>
                        <p className="text-sm font-semibold">Goal: $100,000</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

