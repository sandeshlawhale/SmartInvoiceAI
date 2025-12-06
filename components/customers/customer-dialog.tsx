"use client";

import { useEffect, useState } from "react";
import { useModalStore } from "@/store/useModalStore";
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
import { Customer } from "@/types";

interface CustomerDialogProps {
    onSuccess?: (customer: Customer) => void;
    initialName?: string;
}

export function CustomerDialog({ onSuccess, initialName }: CustomerDialogProps) {
    const {
        isCustomerModalOpen,
        editingCustomer,
        onCloseCustomerModal,
    } = useModalStore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        gstin: "",
    });

    useEffect(() => {
        if (editingCustomer) {
            setFormData({
                name: editingCustomer.name,
                email: editingCustomer.email || "",
                phone: editingCustomer.phone || "",
                address: editingCustomer.address || "",
                gstin: editingCustomer.gstin || "",
            });
        } else {
            setFormData({
                name: initialName || "",
                email: "",
                phone: "",
                address: "",
                gstin: "",
            });
        }
    }, [editingCustomer, isCustomerModalOpen, initialName]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
            const url = editingCustomer
                ? `/api/customers/${editingCustomer._id}`
                : "/api/customers";
            const method = editingCustomer ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const savedCustomer = await response.json();
                toast({
                    title: "Success",
                    description: editingCustomer
                        ? "Customer updated successfully"
                        : "Customer created successfully",
                });
                onCloseCustomerModal();
                if (onSuccess) {
                    onSuccess(savedCustomer);
                }
            } else {
                throw new Error("Failed to save customer");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save customer",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isCustomerModalOpen} onOpenChange={(open) => !open && onCloseCustomerModal()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {editingCustomer ? "Edit Customer" : "Add New Customer"}
                    </DialogTitle>
                    <DialogDescription>
                        {editingCustomer
                            ? "Update customer details"
                            : "Enter the details of the new customer."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Name *</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Address</Label>
                            <Input
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>GSTIN</Label>
                            <Input
                                value={formData.gstin}
                                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onCloseCustomerModal}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : (editingCustomer ? "Update" : "Create") + " Customer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
