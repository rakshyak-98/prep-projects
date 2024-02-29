"use client";
import { DropdownMenu } from "@/app/_components/dropdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/providers/themeProviders";
import { toast } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { Drawer } from "@/app/_components/drawer";
import { useState } from "react";
import {DatePicker} from "@/app/_components/datepicker"

export default function Home() {
    const [openDrawer, setDrawer] = useState(false);
    const [whichDrawer, setWhichDrawer] = useState("");
    function handleWhichDrawer(name: "create" | "open") {
        setWhichDrawer(name);
    }
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <Card className="w-max">
                <CardHeader className="flex justify-between flex-row">
                    <CardTitle>One place to record Expense</CardTitle>
                    <PlusCircle
                        onClick={() => toast().success("todo: add more money to expense")}
                    />
                </CardHeader>
                <CardContent className="flex justify-between gap-2">
                    <DatePicker />
                    <div className="flex gap-2">
                        <DropdownMenu
                            name="open"
                            setDrawer={setDrawer}
                            callback={handleWhichDrawer}
                        ></DropdownMenu>
                        <DropdownMenu
                            name="create"
                            setDrawer={setDrawer}
                            callback={handleWhichDrawer}
                        ></DropdownMenu>
                    </div>
                    <div>
                        <div className="money">You have</div>
                        <span>400</span>
                    </div>
                </CardContent>
            </Card>
            <Drawer
                open={openDrawer}
                setDrawer={setDrawer}
                name={whichDrawer}
            />
        </ThemeProvider>
    );
}

