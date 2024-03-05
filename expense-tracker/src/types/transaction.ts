import {CATEGORY} from "@/lib/enums"
export type Transaction = {
    amount: string;
    comment: string;
    category: CATEGORY;
}
