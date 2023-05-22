"use client";

import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Cart from "./Cart";
import { useCartStore } from "@/store";
import { AiFillShopping } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";

export default function Nav({ user }: Session) {
  const cartStore = useCartStore();
  return (
    <nav className="flex items-center justify-between py-12">
      <Link href={"/"}>
        <h1>styled</h1>
      </Link>

      <ul className="flex items-center gap-12">
        {/* Toggle cart */}
        <li
          onClick={() => cartStore.toggleCart()}
          className="relative flex items-center text-3xl cursor-pointer"
        >
          <AiFillShopping />
          <AnimatePresence>
            {cartStore.cart.length > 0 && (
              <motion.span
                animate={{ scale: 1 }}
                initial={{ scale: 0 }}
                className="absolute flex items-center justify-center w-5 h-5 text-sm font-bold text-white bg-teal-700 rounded-full left-4 bottom-4"
              >
                {cartStore.cart.length}
              </motion.span>
            )}
          </AnimatePresence>
        </li>
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
                width={36}
                height={36}
                className="rounded-full"
              />
            </li>
          </div>
        )}
      </ul>
      <AnimatePresence>{cartStore.isOpen && <Cart />}</AnimatePresence>
    </nav>
  );
}
