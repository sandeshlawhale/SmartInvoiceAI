"use client"

import * as React from "react"
import { Check, ChevronsUpDown, CloudCog, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface Option {
    value: string
    label: string
    [key: string]: any
}

interface AsyncComboboxProps {
    fetcher: (query: string) => Promise<Option[]>
    onSelect: (value: string) => void
    onCreate?: (value: string) => void
    label: string
    value?: string
    placeholder?: string
    emptyText?: string
    className?: string
}

export function AsyncCombobox({
    fetcher,
    onSelect,
    onCreate,
    label,
    value,
    placeholder = "Select...",
    emptyText = "No results found.",
    className,
}: AsyncComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [options, setOptions] = React.useState<Option[]>([])
    const [loading, setLoading] = React.useState(false)
    const [selectedLabel, setSelectedLabel] = React.useState("")

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(true)
            fetcher(query)
                .then((data) => {
                    setOptions(data)
                })
                .catch((err) => {
                    console.error("Failed to fetch options", err)
                    setOptions([])
                })
                .finally(() => {
                    setLoading(false)
                })
        }, 300)

        return () => clearTimeout(timer)
    }, [query, fetcher])

    // Update selected label when value changes
    React.useEffect(() => {
        if (value) {
            // If we have options loaded, try to find the label there
            const option = options.find((o) => o.value === value)
            if (option) {
                setSelectedLabel(option.label)
            } else {
                // If not in options (e.g. initial load), we might need to fetch it or rely on parent to pass label if we wanted to be pure. 
                // But here we can try to fetch if options are empty, or just wait.
                // A better approach for async combobox is to have an initial options prop or initial label prop.
                // For now, let's assume the parent might need to help or we just show the value if label missing? 
                // Actually, let's try to fetch specifically for this value if we don't have it? 
                // Or simpler: The parent usually passes the full object or we just show "Selected" until user opens?
                // Let's rely on the fetcher returning it in the default list if query is empty.
            }
        } else {
            setSelectedLabel("")
        }
    }, [value, options])

    // Initial fetch to populate list
    React.useEffect(() => {
        fetcher("").then(setOptions).catch(console.error)
    }, [])


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                >
                    {selectedLabel || value ? (
                        options.find((option) => option.value === value)?.label || selectedLabel || value
                    ) : (
                        placeholder
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="z-[9999] w-[--radix-popover-trigger-width] p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={`Search ${label.toLowerCase()}...`}
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        {loading && <div className="py-6 text-center text-sm">Loading...</div>}
                        {!loading && options.length === 0 && (
                            <CommandEmpty>{emptyText}</CommandEmpty>
                        )}
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                        onSelect(currentValue === value ? "" : currentValue)
                                        setSelectedLabel(option.label)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                    {option.phone && ` - ${option.phone}`}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        {!loading && onCreate && query.length > 0 && (
                            <CommandGroup>
                                <CommandItem
                                    disabled={false}
                                    onSelect={() => {
                                        console.log("add new", query)
                                        onCreate(query)
                                        setOpen(false)
                                    }}
                                    className="text-primary cursor-pointer"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add "{query}"
                                </CommandItem>
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
