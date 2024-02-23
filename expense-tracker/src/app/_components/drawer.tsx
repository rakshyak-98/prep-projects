import {
    Drawer as _Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
} from "@/components/ui/drawer";
import { DataTableDemo } from "@/app/_components/table";

export const Drawer = ({open, setDrawer}: {open: boolean, setDrawer: any}) => {
    return (
        <_Drawer open={open} onOpenChange={setDrawer}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Your Expenses</DrawerTitle>
                    <DrawerDescription>here is your all spent money</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    <DataTableDemo/>
                </DrawerFooter>
            </DrawerContent>
        </_Drawer>
    ); 

}
