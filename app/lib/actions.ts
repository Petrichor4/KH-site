"use server";

import { sql } from "@vercel/postgres";
import { Blog, HeaderData } from "./definitions";

export async function getHeaderData(): Promise<HeaderData[]> {
  try {
    const request = await sql<HeaderData>`
            SELECT * FROM kh;
        `;
    return request.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getBlogs() {
  try {
    const result = await sql<Blog>`
            SELECT * FROM blogs
        `;
    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getBlog(id: number) {
  try {
    const result = await sql<Blog>`
      SELECT * FROM blogs WHERE id = ${id}
    `
    return result.rows
  } catch (error) {
    console.error(error);
    return []
  }
}
