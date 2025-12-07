"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Customer } from "@/types";

interface CreateCustomerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (customer: Customer) => void;
    initialName?: string;
}

export function CreateCustomerDialog({
    open,
    onOpenChange,
    onSuccess,
    initialName = "",
}: CreateCustomerDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialName,
        email: "",
        phone: "",
        address: "",
        gstin: "",
    });

    // Update name if initialName changes and form is clean? 
    // Actually better to just let user type. 
    // But if they typed "John" in combobox and clicked "Add John", we want "John" prefilled.
    // We'll handle that in useEffect or just initial state if component remounts.
    // Since dialog might be always mounted, we should use useEffect.

    // Actually, simpler to just pass it when opening, but the parent controls state.
    // Let's use a useEffect to sync if open becomes true.

    // For now, let's just use the state.

    const handleSubmit = async () => {
        if (!formData.name) {
            toast({
                title: "Error",
                description: "Name is required",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const newCustomer = await response.json();
                toast({
                    title: "Success",
                    description: "Customer created successfully",
                });
                onSuccess(newCustomer);
                onOpenChange(false);
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    gstin: "",
                });
            } else {
                throw new Error("Failed to create customer");
            }
        } catch {
            toast({
                title: "Error",
                description: "Failed to create customer",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                    <DialogDescription>
                        Enter the details of the new customer.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name *
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Phone
                        </Label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                            Address
                        </Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="gstin" className="text-right">
                            GSTIN
                        </Label>
                        <Input
                            id="gstin"
                            value={formData.gstin}
                            onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Creating..." : "Create Customer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
