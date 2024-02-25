import { useState, useEffect } from "react";
import {
    Drawer as _Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
} from "@/components/ui/drawer";
import { DataTableDemo } from "@/app/_components/table";
import {CreateCategory} from "@/app/_components/expenseForm"

export const Drawer = ({
    open,
    setDrawer,
    name,
}: {
    open: boolean;
    setDrawer: any;
    name?: string;
}) => {
    const [view, setView] = useState(0); // 0: tableView | 1: formView
    const [text, setState] = useState("");
    const [heading, setHeading] = useState("");
    useEffect(() => {
        if (name == "create") {
            setHeading("GO For it Bro")
            setState("Create a new expense plan");
            setView(1);
        }
        if (name == "open") {
            setHeading("Here it is")
            setState("Did you find what and where gone wrong.");
            setView(0);
        }
    }, [name]);
    return (
        <_Drawer
            open={open}
            onOpenChange={setDrawer}
        >
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{heading}</DrawerTitle>
                    <DrawerDescription>{text}</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    {view ? <CreateCategory /> : <DataTableDemo />}
                </DrawerFooter>
            </DrawerContent>
        </_Drawer>
    );
};

