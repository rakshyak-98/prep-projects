import { PlusCircle } from 'lucide-react';
import { useRef } from 'react';
import { toast } from '@/lib/utils';

export const CreateCategory = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    function create(data: any) {
    }
    return (
        <div className="flex gap-2 items-center">
            <input
                ref={inputRef}
                className="p-2 rounded-sm"
                type="text"
                placeholder="Enter category name here"
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

