"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Nav({ user }: Session) {
  return (
    <nav className="flex items-center justify-between py-8">
      <Link href={"/"}>
        <h1>styled</h1>
      </Link>

      <ul className="flex items-center gap-12">
        {/* check if the user is signed in */}
        {!user && (
          <div>
            <li className="px-4 py-2 text-white bg-teal-600 rounded-md">
              <button onClick={() => signIn()}>Sign in</button>
            </li>
            <li>Dashboard</li>
          </div>
        )}
        {user && (
          <div>
            <li>
              <Image
                src={user?.image as string}
                alt={user.name as string}
                width={48}
                height={48}
                className="rounded-full"
              />
            </li>
          </div>
        )}
      </ul>
    </nav>
  );
}
