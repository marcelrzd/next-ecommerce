import Nav from "./components/Nav";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Hydrate from "./components/Hydrate";
import { Roboto, Lobster_Two } from "next/font/google";

export const metadata = {
  title: "Next Eccomerce",
  description: "",
};

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});
const lobster = Lobster_Two({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-lobster",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // fetch user
  const session = await getServerSession(authOptions);
  console.log(session);
  return (
    <html lang="en" className={`${roboto.variable} ${lobster.variable}`}>
      <Hydrate>
        <Nav user={session?.user} expires={session?.expires as string} />
        {children}
      </Hydrate>
    </html>
  );
}
