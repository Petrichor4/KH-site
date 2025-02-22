'use server'

import { sql } from "@vercel/postgres";
import { HeaderData } from "./definitions";

export async function getHeaderData(): Promise<HeaderData[]> {
  try {
    const request = await sql<HeaderData>`
            SELECT * FROM kh;
        `;
    return request.rows;
  } catch (error) {
    console.error(error);
    return []
  }
}
