"use client";

import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { IoLogoGoogle } from "react-icons/io5";
import Cart from "./Cart";
import { useCartStore } from "@/store";
import { AiFillShopping } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import DarkLight from "./DarkLight";

export default function Nav({ user }: Session) {
  const cartStore = useCartStore();
  const handleSignIn = () => {
    window.location.href = "https://accounts.google.com/AccountChooser";
  };

  return (
    <nav className="flex items-center justify-between w-full py-6 bg-base-200">
      <Link href={"/"}>
        <h1 className="ml-6 text-xl font-lobster">Ultimate Game Store</h1>
      </Link>

      <ul className="flex items-center gap-8">
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
                className="absolute flex items-center justify-center w-5 h-5 text-sm font-bold text-white rounded-full bg-primary left-4 bottom-4"
              >
                {cartStore.cart.length}
              </motion.span>
            )}
          </AnimatePresence>
        </li>
        {/* Dark/Light mode */}
        <DarkLight />
        {/* check if the user is signed in */}
        {!user && (
          <details className="mr-6 dropdown dropdown-end">
            <summary className="px-4 py-2 text-white list-none transition ease-in-out rounded-md cursor-pointer bg-primary hover:bg-purple-950">
              Sign In
            </summary>
            <ul className="text-white transition ease-in-out shadow dropdown-content menu">
              <li>
                <button
                  className="px-4 py-2 mt-1 rounded-md bg-primary hover:bg-purple-950"
                  onClick={() => signIn()}
                >
                  <IoLogoGoogle /> Google
                </button>
              </li>
            </ul>
          </details>
        )}
        {user && (
          <div className="mr-6">
            <li>
              <div className="cursor-pointer dropdown dropdown-hover dropdown-end">
                <Image
                  src={user?.image as string}
                  alt={user.name as string}
                  width={36}
                  height={36}
                  className="rounded-full"
                  tabIndex={0}
                />
                <ul
                  tabIndex={0}
                  className="p-4 space-y-4 shadow dropdown-content menu bg-base-100 rounded-box w-72"
                >
                  <Link
                    className="p-4 rounded-md hover:bg-base-300"
                    href={"/dashboard"}
                    onClick={() => {
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                    }}
                  >
                    Orders
                  </Link>
                  <li
                    onClick={() => {
                      signOut();
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                    }}
                    className="p-4 rounded-md hover:bg-base-300"
                  >
                    Sign out
                  </li>
                </ul>
              </div>
            </li>
          </div>
        )}
      </ul>
      <AnimatePresence>{cartStore.isOpen && <Cart />}</AnimatePresence>
    </nav>
  );
}
