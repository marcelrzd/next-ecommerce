import Image from "next/image";
import { SearchParamTypes } from "@/types/SearchParamTypes";
import formatPrice from "@/util/priceFormat";

export default async function Product({ searchParams }: SearchParamTypes) {
  return (
    <div className="flex justify-between gap-24 p-12 text-gray-700">
      <Image
        src={searchParams.image}
        alt={searchParams.name}
        width={600}
        height={600}
      ></Image>
      <div className="font-medium text-gray-700">
        <h1 className="py-2 text-2xl">{searchParams.name}</h1>
        <p className="py-2">{searchParams.description}</p>
        {searchParams.features && (
          <p className="py-2">{searchParams.features}</p>
        )}

        <div className="flex gap-2">
          <p className="font-bold text-teal-700">
            {searchParams.unit_amount !== null
              ? formatPrice(searchParams.unit_amount)
              : "N/A"}
          </p>
        </div>
        <button className="px-6 py-2 my-12 font-medium text-white bg-teal-700 rounded-md">
          Add to cart
        </button>
      </div>
    </div>
  );
}
