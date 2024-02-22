import { DropdownMenu } from "@/app/_components/dropdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeProvider } from "@/providers/themeProviders";
export default function Home() {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <Card className="w-[450px]">
                <CardHeader>
                    <CardTitle>One place to record Expense</CardTitle>
                </CardHeader>
                <CardContent>
                    <DropdownMenu></DropdownMenu>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
}









