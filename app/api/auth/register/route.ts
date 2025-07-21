import z from "zod";
import { NextResponse } from "next/server";
import { addUser } from "@/app/lib/actions";

type PostgresError = {
  code: string;
  detail?: string;
  message: string;
};

const validCredentials = z.object({
  username: z.string(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = validCredentials.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { username, password } = parsed.data;

    try {
      await addUser(username, password);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error(error);
      const pgErr = error as PostgresError;
      if (pgErr.code === "23505") {
        return NextResponse.json({ error: "Username already exists" }, { status: 409 });
      }
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
