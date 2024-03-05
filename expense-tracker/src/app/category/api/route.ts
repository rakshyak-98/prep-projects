import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"
import { CATEGORY } from "@/lib/enums";

const client = new PrismaClient();

export async function GET(req: NextApiRequest, context: any) {
    const data = client.category.findMany({ select: { id: true, name: true } });
    return NextResponse.json({ data });
}

type RequestBody = {
    amount: number,
    comment: string,
    category: CATEGORY
}

export async function POST(req: NextApiRequest, context: any) {
    const data: RequestBody = req.body;
    return NextResponse.json({ data })
}
