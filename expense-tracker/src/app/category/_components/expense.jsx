import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"

export default function Expense(){
    return (
        <Card className="p-2">
            <div>Create Expense category</div>
            <div>
                <Input type="text" placeholder="Name of the category" className="mb-2" />
                <Input type="text" placeholder="Fix price" className="mb-2" />
                <Button>Create</Button>
            </div>
        </Card>
    );
}
