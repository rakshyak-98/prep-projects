import {
    Drawer as _Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
} from "@/components/ui/drawer";
import { DataTableDemo } from "@/app/_components/table";
import {Dispatch, SetStateAction} from "react" // type annotation

export const Drawer = ({
    open,
    setDrawer,
    name,
}: {
    open: boolean;
    setDrawer: Dispatch<SetStateAction<boolean>>;
    name?: string;
}) => {
    return (
        <_Drawer
            open={open}
            onOpenChange={setDrawer}
        >
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Transaction</DrawerTitle>
                    <DrawerDescription>Showing selected month transactions</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    <DataTableDemo />
                </DrawerFooter>
            </DrawerContent>
        </_Drawer>
    );
};

