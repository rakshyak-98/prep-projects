import { NextResponse, NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"

const client = new PrismaClient();

export async function GET(req: NextRequest, context: any) {
    const data = client.category.findMany({ select: { id: true, name: true } });
    return NextResponse.json({ data })
}
