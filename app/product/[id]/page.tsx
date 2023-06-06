import Image from "next/image";
import { SearchParamTypes } from "@/types/SearchParamTypes";
import formatPrice from "@/util/priceFormat";
import AddCart from "./AddCart";

export default async function Product({ searchParams }: SearchParamTypes) {
  return (
    <div className="flex flex-col items-center justify-between gap-16 2xl:flex-row">
      <Image
        src={searchParams.image}
        alt={searchParams.name}
        width={600}
        height={600}
        className="w-full rounded-lg"
      ></Image>
      <div className="font-medium ">
        <h1 className="py-2 text-2xl">{searchParams.name}</h1>
        <p className="py-2">{searchParams.description}</p>
        {searchParams.features && (
          <p className="py-2">{searchParams.features}</p>
        )}

        <div className="flex gap-2">
          <p className="font-bold text-primary">
            {searchParams.unit_amount !== null
              ? formatPrice(searchParams.unit_amount)
              : "N/A"}
          </p>
        </div>
        <AddCart {...searchParams} />
      </div>
    </div>
  );
}
