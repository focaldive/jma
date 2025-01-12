import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NewsletterSignup() {
    return (
        <Card>
            <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Stay Connected</h2>
                <div className="flex gap-4">
                    <Input placeholder="First Name" className="flex-1" />
                    <Input placeholder="Last Name" className="flex-1" />
                    <Input type="email" placeholder="Email address" className="flex-1" />
                    <Button>Subscribe</Button>
                </div>
            </CardContent>
        </Card>
    );
}

