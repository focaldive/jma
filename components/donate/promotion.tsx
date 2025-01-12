import { Card, CardContent } from "@/components/ui/card";

export function PromiseCard() {
    return (
        <Card>
            <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Our Promise to You</h2>
                <p className="text-sm text-muted-foreground">
                    Every donation made to our registered charities will be utilized with
                    utmost care and transparency. We ensure that your contributions
                    directly benefit those in need.
                </p>
            </CardContent>
        </Card>
    );
}

