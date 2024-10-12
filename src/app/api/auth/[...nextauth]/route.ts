import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user, token }) {
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
  debug: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@mail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        //console.log('credentials', credentials)
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }
        try {
            const res = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
                method: "POST",
                body: JSON.stringify(credentials),
                headers: { "Content-Type": "application/json" },
                credentials: 'include'
              });
              console.log('json', res)
      
              const user = await res.json();
              // If no error and we have user data, return it
              if (res.ok && user) {
                return user;
              }
              // Return null if user data could not be retrieved
              return null;
        }catch(err)  {
            console.log('json', err)
            return null;
        }
        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
