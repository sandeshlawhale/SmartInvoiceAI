import { Twitter, Github, Linkedin, Mail, MapPin } from "lucide-react";

export const NAV_LINKS = [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "FAQ", href: "/#faq" },
    { name: "About", href: "/about" },
];

export const FOOTER_LINKS = {
    product: [
        { name: "Features", href: "/#features" },
        { name: "Pricing", href: "/#pricing" },
        { name: "FAQ", href: "/#faq" },
        // { name: "Integration", href: "#" },
    ],
    company: [
        { name: "About", href: "/about" },
        { name: "Dashboard", href: "/dashboard" },
        // { name: "Blog", href: "#" },
        // { name: "Careers", href: "#" },
        // { name: "Contact", href: "/contact" },
    ],
    legal: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
    ],
    contact: [
        { name: "sandeshlawhale@gmail.com", href: "mailto:sandeshlawhale@gmail.com", icon: "Mail" },
        { name: "Nagpur, Maharashtra, India", href: "", icon: "MapPin" },
    ]
};

export const SOCIAL_LINKS = [
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Github", href: "#", icon: Github },
    { name: "Linkedin", href: "#", icon: Linkedin },
];
