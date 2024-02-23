const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient()

export async function getAllCategory(){
    const allCategory = await prisma.category.findMany()
    console.log(allCategory)
}

export async function createCategory() {
    await prisma.category.create({
        data: {
            name: "grocery"
        },
    });
}

