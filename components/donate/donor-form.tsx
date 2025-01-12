import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function DonorForm() {
    return (
        <Card>
            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    <h2 className="font-semibold text-lg capitalize">
                        Donate without an account
                    </h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="First Name" />
                            <Input placeholder="Last Name" />
                        </div>
                        <Input type="email" placeholder="Email" />
                        <Input placeholder="Phone" />
                        <Input placeholder="Contact Address" />
                        <Input placeholder="Region" />
                    </div>
                    <div className="flex items-start space-x-2">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms" className="text-sm">
                            I accept the terms and conditions
                        </Label>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

