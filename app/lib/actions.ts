"use server";

import { sql } from "@vercel/postgres";
import { Blog, Book, HeaderData, User, Writing, Comment } from "./definitions";
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

export async function editHeaderData(
  heroPhoto: string,
  selfie: string,
  bio: string
) {
  try {
    await sql<HeaderData>`UPDATE kh SET about_me = ${bio}, portrait = ${selfie}, hero_image = ${heroPhoto}`;
  } catch (error) {
    console.error(error);
  }
}

/*
---------------
User actions
---------------
*/

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
    const result =
      await sql`SELECT admin FROM users WHERE username = ${username}`;
    return result.rows[0];
  } catch (error) {
    console.error(error);
    return false;
  }
}

/*
---------------
Blog actions
---------------
*/

export async function getBlogs() {
  try {
    const result = await sql<Blog>`
            SELECT * FROM blogs ORDER BY id DESC
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

export async function addBlogPost(photo: string, title: string, post: string) {
  try {
    await sql`INSERT INTO blogs (photo, title, post) VALUES (${photo}, ${title}, ${post})`;
  } catch (error) {
    console.log(error);
  }
}

export async function editBlogPost(
  photo: string,
  title: string,
  post: string,
  id: string
) {
  try {
    await sql`UPDATE blogs SET photo =${photo}, title = ${title}, post = ${post} WHERE id = ${id}`;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await sql`DELETE FROM blogs WHERE id = ${id}`;
  } catch (error) {
    console.error(error);
  }
}

/*
---------------
Writings actions
---------------
*/

export async function getWritings() {
  try {
    const result = await sql<Writing>`
      SELECT * FROM writings ORDER BY id DESC
    `;
    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getWriting(id: string) {
  try {
    const result = await sql<Writing>`Select * FROM writings WHERE id = ${id}`;
    return result.rows;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function addWritingPost(
  photo: string,
  title: string,
  content: string
) {
  try {
    await sql`INSERT INTO writings (photo, title, content) VALUES (${photo}, ${title}, ${content})`;
  } catch (error) {
    console.log(error);
  }
}

export async function editWritingPost(
  photo: string,
  title: string,
  content: string,
  id: string
) {
  try {
    await sql`UPDATE writings SET photo =${photo}, title = ${title}, content = ${content} WHERE id = ${id}`;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteWritingPost(id: string) {
  try {
    await sql`DELETE FROM writings WHERE id = ${id}`;
  } catch (error) {
    console.error(error);
  }
}

export async function getComments(id: string) {
  try {
    const result = await sql<Comment>`SELECT * FROM comments WHERE writings_id = ${id} ORDER BY created_at DESC`;
    return result.rows
  } catch (error) {
    console.error(error);
    return [];
  }
}


/*
---------------
Book actions
---------------
*/

export async function getBooks() {
  try {
    const result = await sql<Book>`SELECT * FROM books ORDER BY 2 ASC`;
    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getBookById(id: string) {
  try {
    const result = await sql<Book>`SELECT * FROM books WHERE id = ${id}`;
    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function editBook(
  id: string,
  title: string,
  description: string,
  photo: string
) {
  try {
    await sql<Book>`UPDATE books SET title = ${title}, description = ${description}, photo = ${photo} WHERE id = ${id}`;
  } catch (error) {
    console.error(error);
  }
}

export async function addBook(
  title: string,
  description: string,
  photo: string
) {
  try {
    await sql<Book>`INSERT INTO books (title, description, photo) VALUES (${title},${description},${photo})`;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteBook(id: string) {
  try {
    await sql<Book>`DELETE FROM books WHERE id = ${id}`;
  } catch (error) {
    console.error(error);
  }
}
