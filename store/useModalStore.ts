import { create } from "zustand";
import { Seller, Customer, Product } from "@/types";

interface ModalStore {
    // Seller Modal
    isSellerModalOpen: boolean;
    editingSeller: Seller | null;
    onOpenSellerModal: (seller?: Seller) => void;
    onCloseSellerModal: () => void;

    // Customer Modal
    isCustomerModalOpen: boolean;
    editingCustomer: Customer | null;
    onOpenCustomerModal: (customer?: Customer) => void;
    onCloseCustomerModal: () => void;

    // Product Modal
    isProductModalOpen: boolean;
    editingProduct: Product | null;
    onOpenProductModal: (product?: Product) => void;
    onCloseProductModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
    // Seller Modal
    isSellerModalOpen: false,
    editingSeller: null,
    onOpenSellerModal: (seller) =>
        set({ isSellerModalOpen: true, editingSeller: seller || null }),
    onCloseSellerModal: () =>
        set({ isSellerModalOpen: false, editingSeller: null }),

    // Customer Modal
    isCustomerModalOpen: false,
    editingCustomer: null,
    onOpenCustomerModal: (customer) =>
        set({ isCustomerModalOpen: true, editingCustomer: customer || null }),
    onCloseCustomerModal: () =>
        set({ isCustomerModalOpen: false, editingCustomer: null }),

    // Product Modal
    isProductModalOpen: false,
    editingProduct: null,
    onOpenProductModal: (product) =>
        set({ isProductModalOpen: true, editingProduct: product || null }),
    onCloseProductModal: () =>
        set({ isProductModalOpen: false, editingProduct: null }),
}));
