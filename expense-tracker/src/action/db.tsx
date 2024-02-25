import prismaDB from '@/lib/prismadb';

interface ICategory {
    name: string;
}

export async function getAllCategory() {
    return await prismaDB.category.findMany();
}

export async function createCategory(data: ICategory) {
    prismaDB.category.create({ data });
}

