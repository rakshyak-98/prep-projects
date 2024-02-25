"use client";
import { MessageSquare, Plus, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu as _DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";

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
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Quick {name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>{name} category</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                    <span
                                        onClick={() => {
                                            setDrawer(true);
                                            callback(name);
                                        }}
                                    >
                                        Grocery
                                    </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>House</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    <span
                                        onClick={() => {
                                            setDrawer(true);
                                            callback(name);
                                        }}
                                    >
                                        More...
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>{name} income</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                    <span>Salary</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Misc</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    <span>More...</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </_DropdownMenu>
    );
}

