import formatPrice from "@/util/priceFormat";
import Image from "next/image";
import { ProductType } from "@/types/ProductType";
import Link from "next/link";

export default function Product({
  name,
  image,
  unit_amount,
  id,
  description,
  metadata,
}: ProductType) {
  const { features } = metadata;
  return (
    <Link
      href={{
        pathname: `/product/${id}`,
        query: { name, image, unit_amount, id, description, features },
      }}
    >
      <div>
        <Image
          src={image}
          alt={name}
          width={800}
          height={800}
          className="object-cover w-full mt-6 rounded-lg h-96"
          priority={true}
        />
        <div className="mt-2 font-medium">
          <h1>{name}</h1>
          <h2 className="text-sm text-gray-500 ">
            {unit_amount !== null ? formatPrice(unit_amount) : "N/A"}
          </h2>
        </div>
      </div>
    </Link>
  );
}
