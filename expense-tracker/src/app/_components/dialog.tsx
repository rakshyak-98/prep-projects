import { Button } from '@/components/ui/button';
import {
    Dialog as _Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/app/_components/categorySelector';

export function Dialog() {
    return (
        <_Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Create</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create transaction</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                            htmlFor="amount"
                            className="text-right"
                        >
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            className="col-span-3"
                            placeholder="Enter amount"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                            htmlFor="comment"
                            className="text-right"
                        >
                            Comment
                        </Label>
                        <Input
                            id="comment"
                            className="col-span-3"
                            placeholder="Enter a comment"
                        />
                    </div>
                    <Select />
                </div>
                <DialogFooter>
                    <Button type="submit">Create</Button>
                </DialogFooter>
            </DialogContent>
        </_Dialog>
    );
}

