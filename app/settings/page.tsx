"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SellerDialog } from "@/components/sellers/seller-dialog";
import { useModalStore } from "@/store/useModalStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { Seller } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const { onOpenSellerModal } = useModalStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await fetch("/api/sellers");
      if (response.ok) {
        const data = await response.json();
        setSellers(data);
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this seller?")) return;

    try {
      const response = await fetch(`/api/sellers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Seller deleted successfully",
        });
        fetchSellers();
      } else {
        throw new Error("Failed to delete seller");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete seller",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (seller: Seller) => {

    try {
      const response = await fetch(`/api/sellers/${seller._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...seller, isDefault: true }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Default profile updated",
        });
        fetchSellers();
      } else {
        throw new Error("Failed to update default profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update default profile",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-9 w-32 mb-2" />
              <Skeleton className="h-5 w-48" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profiles</h1>
            <p className="text-muted-foreground">Manage your seller profiles</p>
          </div>
          <Button onClick={() => onOpenSellerModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Profile
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>GSTIN</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellers.length > 0 ? (
                  sellers.map((seller) => (
                    <TableRow key={seller._id}>
                      <TableCell className="font-medium">
                        {seller.businessName}
                      </TableCell>
                      <TableCell>{seller.gstin || "-"}</TableCell>
                      <TableCell>{seller.phone || "-"}</TableCell>
                      <TableCell>{seller.email || "-"}</TableCell>
                      <TableCell>
                        {seller.isDefault ? (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                            Default
                          </span>
                        ) : (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                              >
                                Set Default
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60">
                              <div className="grid gap-4">
                                <div className="space-y-2">
                                  <h4 className="font-medium leading-none">Confirm Action</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Set {seller.businessName} as your default profile?
                                  </p>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleSetDefault(seller)}
                                  >
                                    Confirm
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onOpenSellerModal(seller)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(seller._id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No profiles found. Create your first profile.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <SellerDialog onSuccess={fetchSellers} />
      </div>
    </DashboardLayout>
  );
}

