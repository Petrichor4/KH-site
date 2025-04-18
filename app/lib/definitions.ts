export interface HeaderData {
  about_me: string;
  portrait: string;
  hero_image: string;
}

export interface Blog {
  id: string;
  title: string;
  photo: string;
  post: string;
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
}

export interface Book {
  id: string;
  title: string;
  description: string | null;
  photo: string;
  price: string;
  links: string[];
}
