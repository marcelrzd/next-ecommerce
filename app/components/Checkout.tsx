"use client";

import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCartStore, useThemeStore } from "@/store";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CheckoutForm from "./CheckoutForm";
import OrderAnimation from "./OrderAnimation";
import { motion } from "framer-motion";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Checkout() {
  const themeStore = useThemeStore();
  const [theme, setTheme] = useState<"flat" | "stripe" | "night" | "none">(
    "stripe"
  );
  const cartStore = useCartStore();
  const [clientSecret, setClientSecret] = useState("");
  const router = useRouter();

  // todo: check why stripe elements disappear
  useEffect(() => {
    // set stripe theme
    if (themeStore.mode === "light") {
      setTheme("stripe");
    } else {
      setTheme("night");
    }

    // Create payment intent when the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartStore.cart,
        payment_intent_id: cartStore.paymentIntent,
      }),
    })
      .then((res) => {
        if (res.status === 403) {
          return router.push("/api/auth/signin");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setClientSecret(data.payment_intent?.client_secret);
        cartStore.setPaymentIntent(data.payment_intent?.id);
      });
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: theme,
      labels: "floating",
    },
  };
  return (
    <div className="mt-20">
      {!clientSecret && <OrderAnimation />}
      {clientSecret && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        </motion.div>
      )}
    </div>
  );
}
