import z from "zod";
import { NextResponse } from "next/server";
import { addUser } from "@/app/lib/actions";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const validCredentials = z.object({
      username: z.string(),
      password: z.string().min(6),
    });
    if (!validCredentials) {
      return NextResponse.json("", { status: 400 });
    }
    await addUser(username, password);
    console.log({ username, password })
    return NextResponse.json({message: "success"})
  } catch (error) {
    console.error(error);
  }
}
