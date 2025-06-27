export interface HeaderData {
  about_me: string;
  portrait: string;
  hero_image: string;
  events: string;
}

export interface Blog {
  id: string;
  title: string;
  photo: string;
  post: string;
  draft: boolean;
}

export interface User {
  id: string;
  username: string;
  password: string;
  admin: boolean;
}

export interface Writing {
  id: string;
  title: string;
  content: string;
  photo: string;
  draft: boolean;
}

export interface Book {
  id: string;
  title: string;
  description: string | null;
  photo: string;
  price: string;
  links: string[];
}

export interface Comment {
  id: number;
  writings_id: string;
  blog_id: string;
  author: string;
  body: string;
  likes: string[];
  created_at: string;
}
export interface Reply {
  id: number;
  comment_id: string;
  author: string;
  body: string;
  likes: string[];
  created_at: string;
}
