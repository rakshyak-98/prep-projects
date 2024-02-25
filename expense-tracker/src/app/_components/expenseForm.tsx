import {PlusCircle} from "lucide-react"
import { toast } from "@/lib/utils"
export const ExpenseForm = () => {
    return (
        <form>
            <div className="flex gap-2 items-center">
                <input className="p-2 rounded-sm" type="text" placeholder="Enter category name here" />
                <PlusCircle onClick={() => toast().success("this is a message")}/>
            </div>
        </form>
    );
}
