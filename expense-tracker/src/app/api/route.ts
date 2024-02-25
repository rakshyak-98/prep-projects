import { NextResponse, NextRequest } from "next/server"
import { getAllCategory } from "@/action/db"

export async function GET(req: NextRequest, context: any) {
    console.log(req.body)
    const data = await getAllCategory()
    return NextResponse.json({ data })
}
