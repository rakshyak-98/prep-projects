"use client";
import { MessageSquare, Plus, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu as _DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DropdownMenu({
    name,
    setDrawer,
    callback = (name: string) => {},
}: {
    name: "open" | "create";
    setDrawer: any;
    callback?: Function;
}) {
    return (
        <_DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">{name}</Button>
            </DropdownMenuTrigger>
        </_DropdownMenu>
    );
}

