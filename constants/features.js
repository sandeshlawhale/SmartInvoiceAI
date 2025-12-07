import { Zap, Scan, LayoutTemplate, Eye, Calculator, FileDown, Users, Library, Moon, Lock } from "lucide-react";

export const FEATURES = [
    {
        title: "AI-Powered Invoice Generation",
        description: "Create invoices instantly from natural text or product descriptions.",
        icon: Zap,
        className: "md:col-span-2",
    },
    {
        title: "Smart Item Detection",
        description: "Automatically extracts item names, quantities, prices, GST, and totals.",
        icon: Scan,
        className: "md:col-span-1",
    },
    {
        title: "Multi-Template Support",
        description: "Choose from clean, professional invoice templates.",
        icon: LayoutTemplate,
        className: "md:col-span-1",
    },
    {
        title: "Real-Time Preview",
        description: "See your invoice update live as you type.",
        icon: Eye,
        className: "md:col-span-2",
    },
    {
        title: "Auto-Calculate GST",
        description: "IGST/CGST/SGST detection based on state pair.",
        icon: Calculator,
        className: "md:col-span-1",
    },
    {
        title: "Download as PDF",
        description: "High-quality, print-ready PDFs in one click.",
        icon: FileDown,
        className: "md:col-span-1",
    },
    {
        title: "Save & Reuse Customer Data",
        description: "Quick access to frequently used clients.",
        icon: Users,
        className: "md:col-span-1",
    },
    {
        title: "Product Library (Starter)",
        description: "Save your commonly used products for faster invoicing.",
        icon: Library,
        className: "md:col-span-1",
    },
    {
        title: "Dark & Light Mode",
        description: "Seamless theme switching.",
        icon: Moon,
        className: "md:col-span-1",
    },
    {
        title: "Secure Login with JWT",
        description: "Protects your invoice data and history.",
        icon: Lock,
        className: "md:col-span-1",
    },
];
