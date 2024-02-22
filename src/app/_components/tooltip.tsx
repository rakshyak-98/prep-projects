import {
    Tooltip as _Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

export const Tooltip = ({ children, text }: { children: React.ReactElement; text: string }) => {
    return (
        <TooltipProvider>
            <_Tooltip >
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent>{text}</TooltipContent>
            </_Tooltip>
        </TooltipProvider>
    );
};
