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
import { Product } from "@/types";

interface ProductDialogProps {
    onSuccess?: (product: Product) => void;
    initialName?: string;
}

export function ProductDialog({ onSuccess, initialName }: ProductDialogProps) {
    const {
        isProductModalOpen,
        editingProduct,
        onCloseProductModal,
    } = useModalStore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        gst: "",
        hsnCode: "",
        category: "",
    });

    useEffect(() => {
        if (editingProduct) {
            setFormData({
                name: editingProduct.name,
                price: editingProduct.price.toString(),
                gst: editingProduct.gst.toString(),
                hsnCode: editingProduct.hsnCode || "",
                category: editingProduct.category || "",
            });
        } else {
            setFormData({
                name: initialName || "",
                price: "",
                gst: "",
                hsnCode: "",
                category: "",
            });
        }
    }, [editingProduct, isProductModalOpen, initialName]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) {
            toast({
                title: "Error",
                description: "Product name is required",
                variant: "destructive",
            });
            return;
        }

        if (!formData.price) {
            toast({
                title: "Error",
                description: "Price is required",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const url = editingProduct
                ? `/api/products/${editingProduct._id}`
                : "/api/products";
            const method = editingProduct ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    price: Number(formData.price),
                    gst: Number(formData.gst) || 0,
                    hsnCode: formData.hsnCode,
                    category: formData.category,
                }),
            });

            if (response.ok) {
                const savedProduct = await response.json();
                toast({
                    title: "Success",
                    description: editingProduct
                        ? "Product updated successfully"
                        : "Product created successfully",
                });
                onCloseProductModal();
                if (onSuccess) {
                    onSuccess(savedProduct);
                }
            } else {
                throw new Error("Failed to save product");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save product",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isProductModalOpen} onOpenChange={(open) => !open && onCloseProductModal()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {editingProduct ? "Edit Product" : "Add New Product"}
                    </DialogTitle>
                    <DialogDescription>
                        {editingProduct
                            ? "Update product details"
                            : "Add a new product to your catalog"}
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
                                <Label>Price *</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>GST %</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.gst}
                                    onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>HSN Code</Label>
                                <Input
                                    value={formData.hsnCode}
                                    onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Input
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onCloseProductModal}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : (editingProduct ? "Update" : "Create") + " Product"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
