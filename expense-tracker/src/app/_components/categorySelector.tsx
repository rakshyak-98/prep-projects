import * as React from 'react';

import {
    Select as _Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ICategory {
    id: Number;
    label: string;
    value: string;
}

export function Select() {
    const [categoryList, setCategoryList] = React.useState([]);
    return (
        <_Select>
            <SelectTrigger>
                <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {categoryList.map((data: ICategory) => {
                        return (
                            <>
                                <SelectLabel>{data.label}</SelectLabel>
                                <SelectItem value={data.id.toString()}>{data.value}</SelectItem>
                            </>
                        );
                    })}
                </SelectGroup>
            </SelectContent>
        </_Select>
    );
}

