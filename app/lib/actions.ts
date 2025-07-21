"use server";

import { sql } from "@vercel/postgres";
import { Blog, Book, HeaderData, User, Writing, Comment, Reply } from "./definitions";
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
    console.error(error)
  }
}

export async function editEventText(text: string) {
  try {
    await sql<HeaderData>`UPDATE kh SET events = ${text}`
  } catch (error) {
    console.error(error)
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
    await sql<User>`INSERT INTO users (username, password) VALUES (${username}, ${hashedPassword})`;
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

export async function addBlogPost(photo: string, title: string, post: string, draft: boolean) {
  try {
    await sql`INSERT INTO blogs (photo, title, post, draft) VALUES (${photo}, ${title}, ${post}, ${draft})`;
  } catch (error) {
    console.log(error);
  }
}

export async function editBlogPost(
  photo: string,
  title: string,
  post: string,
  id: string,
  draft: boolean,
) {
  try {
    await sql`UPDATE blogs SET photo =${photo}, title = ${title}, post = ${post}, draft = ${draft} WHERE id = ${id}`;
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
  content: string,
  draft: boolean
) {
  try {
    await sql`INSERT INTO writings (photo, title, content, draft) VALUES (${photo}, ${title}, ${content}, ${draft})`;
  } catch (error) {
    console.log(error);
  }
}

export async function editWritingPost(
  photo: string,
  title: string,
  content: string,
  id: string,
  draft: boolean
) {
  try {
    await sql`UPDATE writings SET photo =${photo}, title = ${title}, content = ${content}, draft = ${draft} WHERE id = ${id}`;
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

/*
-------------
Comment actions
-------------
*/

export async function addLike(username: string, id: number) {
  try {
    await sql<Comment>`UPDATE comments SET likes = CASE WHEN NOT (${username} = ANY(likes)) THEN array_append(likes, ${username}) ELSE likes END WHERE id = ${id};`;
  } catch (error) {
    console.error(error);
  }
}

export async function removeLike(id: number, username:string) {
      try {
      await sql<Comment>`UPDATE comments SET likes = array_remove(likes, ${username}) WHERE id = ${id}`
    } catch (error) {
      console.error(error);
    }
}

export async function getCommentsForWritings(id: number) {
  try {
    const result =
      await sql<Comment>`SELECT * FROM comments WHERE writings_id = ${id} ORDER BY created_at DESC`;
    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getCommentsForBlogs(id: number) {
  try {
    const result =
      await sql<Comment>`SELECT * FROM comments WHERE blog_id = ${id} ORDER BY created_at DESC`;
    return result.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}


export async function addComment(writingId: number | null, blogId: number | null, username: string, body: string) {
  try {
    await sql<Comment>`INSERT INTO comments (writings_id, blog_id, author, body) VALUES (${writingId}, ${blogId},${username},${body})`;
  } catch (error) {
    console.error(error);
  }
}

export async function editComment(id: number, username: string, body: string) {
  try {
    await sql<Comment>`UPDATE comments SET body = ${body} WHERE id = ${id} AND author = ${username}`;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteComment(id: number, username: string) {
  try {
    await sql<Comment>`DELETE FROM comments WHERE id = ${id} and author = ${username}`
  } catch (error) {
    console.error(error)
  }
}

export async function replyComment(id: number, username: string, body: string) {
  try {
    await sql`INSERT INTO replies (comment_id, author, body) values(${id}, ${username}, ${body});`
  } catch (error) {
    console.error(error);
  }
}

export async function getReplies(id: number,) {
  try {
    const result = await sql<Reply>`SELECT * FROM replies WHERE comment_id = ${id}`
    return result.rows
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function editReply(id: number, author: string, body: string) {
  try {
    await sql<Reply>`UPDATE replies SET body = ${body} WHERE author = ${author} and id = ${id}`
  } catch (error) {
    console.error(error);
  }
}

export async function deleteReply(id: number, author: string) {
  try{
    await sql<Reply>`DELETE FROM replies WHERE id = ${id} AND author = ${author}`
  } catch (error) {
    console.error(error)
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
