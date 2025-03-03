"use server";

import { sql } from "@vercel/postgres";
import { Blog, HeaderData, User, Writing } from "./definitions";
import bcrypt from "bcrypt";

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
    `;
    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function addUser(username: string, password: string) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    await sql<User>`INSERT INTO users (username, password) VALUES (${username}, ${hashedPassword})`;
  } catch (error) {
    console.error(error);
  }
}

export async function getUserByUsername(username: string) {
  try {
    const user =
      await sql<User>`SELECT * FROM users WHERE username = ${username}`;
    return user;
  } catch (error) {
    console.error(error);
  }
}

export async function getUserAdminStatus(username: string) {
  try {
    const result = await sql`SELECT admin FROM users WHERE username = ${username}`
    return result.rows[0]
  } catch (error) {
    console.error(error);
    return false
  }
}

export async function getWritings() {
  try {
    const result = await sql<Writing>`
      SELECT * FROM writings
    `
    return result.rows
  } catch (error) {
    console.error(error);
    return []
  }
}

export async function getWriting(id: string) {
  try {
    const result = await sql<Writing>`Select * FROM writings WHERE id = ${id}`;
    return result.rows
  } catch (error) {
    console.log(error);
    return []
  }
}

export async function addPost(photo: string, title: string, post: string) {
  try {
    await sql`INSERT INTO blogs (photo, title, post) VALUES (${photo}, ${title}, ${post})`
  } catch (error) {
    console.log(error)
  }
}

export async function editPost(photo: string, title: string, post: string, id: string) {
  try {
    await sql`UPDATE blogs SET photo =${photo}, title = ${title}, post = ${post} WHERE id = ${id}`
  } catch (error) {
    console.log(error)
  }
}

export async function deletePost(id: string) {
  try {
    await sql`DELETE FROM blogs WHERE id = ${id}`
  } catch (error) {
    console.error(error);
  }
}