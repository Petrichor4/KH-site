"use server";

import { sql } from "@vercel/postgres";
import { Blog, HeaderData } from "./definitions";
import bcrypt from 'bcrypt'

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

export async function addUser(name:string, email: string, password: string) {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  try {
      await sql`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${hashedPassword})`
  } catch (error) {
      console.error(error)
  }
}

export async function getUserByUsername(username: string) {
  try {
    const user =
      await sql`SELECT * FROM users WHERE username = ${username}`;
    return user;
  } catch (error) {
    console.error(error);
  }
}

