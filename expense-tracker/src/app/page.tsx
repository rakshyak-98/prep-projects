'use client';
import { useState } from 'react';
import { DropdownMenu } from '@/app/_components/dropdown';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeProvider } from '@/providers/themeProviders';
import { Drawer } from '@/app/_components/drawer';
import { ReceiptText } from 'lucide-react';
import { DatePicker } from '@/app/_components/datepicker';
import { Tooltip } from '@/app/_components/tooltip';
import { Dialog } from '@/app/_components/dialog';

export default function Home() {
    const [openDrawer, setDrawer] = useState(false);
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
                    <Tooltip text="Click to view your transactions">
                        <ReceiptText
                            className="cursor-pointer"
                            onClick={() => {
                                setDrawer(true);
                            }}
                        />
                    </Tooltip>
                </CardHeader>
                <CardContent className="flex justify-between gap-2">
                    <DatePicker />
                    <Dialog />
                </CardContent>
                <CardFooter className="justify-between">
                    <div className="text-green-400">
                        <div className="money">total money in</div>
                        <span>1000</span>
                    </div>
                    <div className="text-red-400">
                        <div className="money">total money out</div>
                        <span>400</span>
                    </div>
                </CardFooter>
            </Card>
            <Drawer
                open={openDrawer}
                setDrawer={setDrawer}
            />
        </ThemeProvider>
    );
}

