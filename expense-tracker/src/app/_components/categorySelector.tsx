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

import {CATEGORY} from "@/lib/enums"

interface ICategory {
    id: Number;
    label: Number;
    value: string;
}

const categoryOptions: ICategory[] = [
    {
        id: 1,
        label: CATEGORY.Grocery,
        value: 'grocery',
    },
    {
        id: 2,
        label: CATEGORY.Outdoor,
        value: 'outdoor'
    },
    {
       id: 3,
        label: CATEGORY.Friend,
        value: 'friend'
    }
];

export function Select() {
    const [categoryList, setCategoryList] = React.useState(categoryOptions);
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
                                {/* <SelectLabel>{data.label}</SelectLabel> */}
                                <SelectItem value={data.id.toString()}>{data.value}</SelectItem>
                            </>
                        );
                    })}
                </SelectGroup>
            </SelectContent>
        </_Select>
    );
}

