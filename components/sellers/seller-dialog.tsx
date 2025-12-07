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
import { Seller } from "@/types";

interface SellerDialogProps {
    onSuccess?: (seller: Seller) => void;
}

export function SellerDialog({ onSuccess }: SellerDialogProps) {
    const {
        isSellerModalOpen,
        editingSeller,
        onCloseSellerModal,
    } = useModalStore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        businessName: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        gstin: "",
        phone: "",
        email: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        isDefault: false,
        customField: "",
    });

    useEffect(() => {
        if (editingSeller) {
            setFormData({
                businessName: editingSeller.businessName || "",
                address: editingSeller.address || "",
                city: editingSeller.city || "",
                state: editingSeller.state || "",
                pincode: editingSeller.pincode || "",
                gstin: editingSeller.gstin || "",
                phone: editingSeller.phone || "",
                email: editingSeller.email || "",
                bankName: editingSeller.bankName || "",
                accountNumber: editingSeller.accountNumber || "",
                ifscCode: editingSeller.ifscCode || "",
                isDefault: editingSeller.isDefault || false,
                customField: editingSeller.customField || "",
            });
        } else {
            setFormData({
                businessName: "",
                address: "",
                city: "",
                state: "",
                pincode: "",
                gstin: "",
                phone: "",
                email: "",
                bankName: "",
                accountNumber: "",
                ifscCode: "",
                isDefault: false,
                customField: "",
            });
        }
    }, [editingSeller, isSellerModalOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.businessName) {
            toast({
                title: "Error",
                description: "Business name is required",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const url = editingSeller
                ? `/api/sellers/${editingSeller._id}`
                : "/api/sellers";
            const method = editingSeller ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const savedSeller = await response.json();
                toast({
                    title: "Success",
                    description: editingSeller
                        ? "Seller updated successfully"
                        : "Seller created successfully",
                });
                onCloseSellerModal();
                if (onSuccess) {
                    onSuccess(savedSeller);
                }
            } else {
                throw new Error("Failed to save seller");
            }
        } catch {
            toast({
                title: "Error",
                description: "Failed to save seller",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isSellerModalOpen} onOpenChange={(open) => !open && onCloseSellerModal()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {editingSeller ? "Edit Seller" : "Add New Seller"}
                    </DialogTitle>
                    <DialogDescription>
                        {editingSeller
                            ? "Update seller information"
                            : "Create a new seller profile"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <h3 className="font-semibold">Business Information</h3>
                        <div className="space-y-2">
                            <Label>Business Name *</Label>
                            <Input
                                value={formData.businessName}
                                onChange={(e) =>
                                    setFormData({ ...formData, businessName: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Address</Label>
                            <Input
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({ ...formData, address: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>City</Label>
                                <Input
                                    value={formData.city}
                                    onChange={(e) =>
                                        setFormData({ ...formData, city: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>State</Label>
                                <Input
                                    value={formData.state}
                                    onChange={(e) =>
                                        setFormData({ ...formData, state: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Pincode</Label>
                                <Input
                                    value={formData.pincode}
                                    onChange={(e) =>
                                        setFormData({ ...formData, pincode: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>GSTIN</Label>
                            <Input
                                value={formData.gstin}
                                onChange={(e) =>
                                    setFormData({ ...formData, gstin: e.target.value.toUpperCase() })
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold">Contact Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold">Bank Details</h3>
                        <div className="space-y-2">
                            <Label>Bank Name</Label>
                            <Input
                                value={formData.bankName}
                                onChange={(e) =>
                                    setFormData({ ...formData, bankName: e.target.value })
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Account Number</Label>
                                <Input
                                    value={formData.accountNumber}
                                    onChange={(e) =>
                                        setFormData({ ...formData, accountNumber: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>IFSC Code</Label>
                                <Input
                                    value={formData.ifscCode}
                                    onChange={(e) =>
                                        setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isDefault"
                            checked={formData.isDefault}
                            onChange={(e) =>
                                setFormData({ ...formData, isDefault: e.target.checked })
                            }
                            className="rounded"
                        />
                        <Label htmlFor="isDefault" className="cursor-pointer">
                            Set as default seller
                        </Label>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCloseSellerModal}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : (editingSeller ? "Update" : "Create") + " Seller"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
