import prismaDB from "@/lib/prismadb";

interface ICategory {
    name: string 
}

class Category implements ICategory{
    name: string
    constructor(name: string){
        this.name = name;
    }
}

export async function getAllCategory() {
    return await prismaDB.category.findMany();
}

export async function createCategory(){
    const category: ICategory = new Category("grocery")
    prismaDB.category.create({data: category})
}
