import {Transaction} from "@/types/transaction"
import yup from "yup";

let schema = yup.object({
    amount: yup.number().required().integer(),
    comment: yup.string().required(),
    category: yup.number().required().integer(),
}) 

export async function createTransition(formData: yup.InferType<typeof schema>){
    const isValid = await schema.validate(formData);
    if (!isValid){
        throw Error("Invalid form data.");
    }
}
