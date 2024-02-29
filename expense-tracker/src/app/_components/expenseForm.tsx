import { PlusCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from '@/lib/utils';
import { DatePicker } from '@/app/_components/datepicker';

export const CreateCategory = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    function create(data: any) {}
    return (
        <div className="flex flex-col gap-2 items-center">
            <input
                type="number"
                placeholder="Enter amount"
            />
            <input
                ref={inputRef}
                className="p-2 rounded-sm"
                type="text"
                placeholder="Enter category name"
            />
            <PlusCircle
                onClick={() => {
                    toast().success('this is a message');
                    create(inputRef.current?.value);
                }}
            />
        </div>
    );
};

