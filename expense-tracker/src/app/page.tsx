"use client"
import { DropdownMenu } from "@/app/_components/dropdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/providers/themeProviders";
import {toast} from "react-toastify"
import { PlusCircle} from "lucide-react";
import {Drawer} from "@/app/_components/drawer"
import { useState } from "react";


export default function Home() {
    const [openDrawer, setDrawer] = useState(false);
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <Card className="w-[450px]">
                <CardHeader className="flex justify-between flex-row">
                    <CardTitle>One place to record Expense</CardTitle>
                    <Button
                        onClick={() => {
                            toast.success("click");
                        }}
                    >
                        <PlusCircle />
                    </Button>
                </CardHeader>
                <CardContent className="flex justify-between">
                    <div className="flex gap-2">
                        <DropdownMenu
                            name="open"
                            setDrawer={setDrawer}
                        ></DropdownMenu>
                        <DropdownMenu
                            name="create"
                            setDrawer={setDrawer}
                        ></DropdownMenu>
                    </div>
                    <div>
                        <div className="money">You have</div>
                        <span>400</span>
                    </div>
                </CardContent>
            </Card>
            <Drawer open={openDrawer} setDrawer={setDrawer}/>
        </ThemeProvider>
    );
}



