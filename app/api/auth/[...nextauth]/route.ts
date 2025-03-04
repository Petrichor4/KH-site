import { getUserByUsername } from "../../../lib/actions";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
  jwt: {
    maxAge: 2 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        //

        console.log(credentials)

        if (!credentials?.username) {
          return null;
        }
        const response = await getUserByUsername(credentials.username);
        
        console.log({ response });

        if (!response) {
          return null;
        }

        const user = response.rows[0];
        const passwordCorrect = await compare(
          credentials.password || "",
          user.password
        );

        console.log(passwordCorrect)

        if (passwordCorrect) {
          return {
            id: user.id,
            name: user.username
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login'
  },
});

export { handler as GET, handler as POST };
