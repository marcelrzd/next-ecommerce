"use client";

import { useCartStore } from "@/store";
import { AddCartType } from "@/types/AddCartType";
import { useState } from "react";

export default function AddCart({
  name,
  id,
  image,
  unit_amount,
  quantity,
}: AddCartType) {
  const cartStore = useCartStore();
  const [added, setAdded] = useState(false);

  // const handleAddToCart = () => {
  //   cartStore.addProduct({ name, id, image, unit_amount, quantity });
  //   setAdded(true);
  //   setTimeout(() => {
  //     setAdded(false);
  //   }, 500);
  // };

  return (
    <>
      <button
        onClick={() =>
          cartStore.addProduct({ id, image, name, unit_amount, quantity })
        }
        className="px-6 py-2 my-12 font-medium text-white bg-teal-700 rounded-md"
      >
        Add to cart
      </button>
    </>
  );
}
