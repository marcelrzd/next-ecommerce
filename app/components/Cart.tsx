"use client";

import Image from "next/image";
import { useCartStore } from "@/store";
import formatPrice from "@/util/priceFormat";
import {
  IoRemoveCircleOutline,
  IoAddCircleOutline,
  IoClose,
} from "react-icons/io5";
import basket from "@/public/emptyBasket.png";
import { AnimatePresence, motion } from "framer-motion";
import Checkout from "./Checkout";
import OrderConfirmed from "./OrderConfirmed";

export default function Cart() {
  const cartStore = useCartStore();

  // Total Amount
  const totalAmount = cartStore.cart.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity;
  }, 0);

  return (
    // Background
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => cartStore.toggleCart()}
      className="fixed top-0 left-0 w-full h-screen 2-full bg-black/25"
    >
      {/* Cart */}
      <motion.div
        layout
        onClick={(e) => e.stopPropagation()}
        className="absolute top-0 right-0 w-full h-screen p-12 overflow-y-scroll bg-white lg:w-2/5"
      >
        <motion.div layout className="absolute top-0 right-0 w-full p-12">
          {cartStore.onCheckout === "checkout" && (
            <button
              onClick={() => cartStore.setCheckout("cart")}
              className="float-left font-medium cursor-pointer"
            >
              Back to Shopping List
            </button>
          )}
          {cartStore.onCheckout === "cart" && (
            <h1 className="float-left font-medium">Shopping List</h1>
          )}
          <button
            onClick={() => cartStore.toggleCart()}
            className="float-right pb-12 font-bold cursor-pointer text-md"
          >
            <IoClose />
          </button>
        </motion.div>
        {cartStore.onCheckout === "cart" && (
          <>
            {cartStore.cart.map((item) => (
              <motion.div
                layout
                key={item.id}
                className="flex gap-4 py-4 mt-16"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={120}
                  height={120}
                  className="object-cover h-24 rounded-md"
                ></Image>
                <motion.div layout>
                  <h2>{item.name}</h2>
                  {/* Update item quantity */}
                  <div className="flex gap-2 text-md">
                    <h2>Quantity: {item.quantity}</h2>
                    <button
                      onClick={() =>
                        cartStore.removeProduct({
                          id: item.id,
                          image: item.image,
                          name: item.name,
                          quantity: item.quantity,
                          unit_amount: item.unit_amount,
                        })
                      }
                    >
                      <IoRemoveCircleOutline />
                    </button>
                    <button
                      onClick={() =>
                        cartStore.addProduct({
                          id: item.id,
                          image: item.image,
                          name: item.name,
                          quantity: item.quantity,
                          unit_amount: item.unit_amount,
                        })
                      }
                    >
                      <IoAddCircleOutline />
                    </button>
                  </div>

                  <p className="text-sm">
                    {item.unit_amount !== null
                      ? formatPrice(item.unit_amount)
                      : "N/A"}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </>
        )}

        {cartStore.cart.length > 0 && cartStore.onCheckout === "cart" ? (
          // Total amount and checkout
          <motion.div layout className="my-10">
            <p>Total: {formatPrice(totalAmount)}</p>

            <button
              onClick={() => cartStore.setCheckout("checkout")}
              className="w-full my-4 btn btn-primary"
            >
              Checkout
            </button>
          </motion.div>
        ) : null}
        {/* Checkout form */}
        {cartStore.onCheckout === "checkout" && <Checkout />}
        {cartStore.onCheckout === "success" && <OrderConfirmed />}
        <AnimatePresence>
          {!cartStore.cart.length && cartStore.onCheckout === "cart" && (
            <motion.div
              initial={{ scale: 0, rotateZ: -10, opacity: 0 }}
              animate={{ scale: 1, rotateZ: 0, opacity: 0.75 }}
              className="flex flex-col items-center gap-12 pt-56 text-2xl font-medium opacity-75"
            >
              <h1>Your cart is empty 😢</h1>
              <Image src={basket} alt="Empty Basket" width={200} height={200} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
