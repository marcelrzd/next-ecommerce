import { authOptions } from "@/pages/api/auth/[...nextauth]";
import formatPrice from "@/util/priceFormat";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import Image from "next/image";

export const revalidate = 0;

const fetchOrders = async () => {
  const prisma = new PrismaClient();
  const user = await getServerSession(authOptions);
  if (!user) {
    return null;
  }

  const orders = await prisma.order.findMany({
    where: { userId: user?.user?.id },
    include: { products: true },
  });

  return orders;
};

export default async function Dashboard() {
  const orders = await fetchOrders();
  console.log(orders);
  if (orders === null) {
    return <div>You need to be logged in to view your orders</div>;
  }
  if (orders.length === 0) {
    return (
      <div>
        <h1>No Orders Placed</h1>
      </div>
    );
  }
  return (
    <div>
      <div>
        {orders.map((order) => (
          <div
            className={`${
              order.status === "complete"
                ? "hover:border-teal-500"
                : "hover:border-orange-500"
            } p-8 my-4 space-y-2 transition duration-500 ease-in-out border-2 border-solid rounded-lg border-base-200 bg-base-200 `}
            key={order.id}
          >
            <h2>Order Reference: {order.id}</h2>
            <p className="py-2 text-xs">
              Status:{" "}
              <span
                className={`${
                  order.status === "complete" ? "bg-teal-500" : "bg-orange-500"
                } text-white text-sm py-1 px-2 mx-2 rounded-md`}
              >
                {order.status}
              </span>
            </p>
            <p className="text-xs">
              Time: {order.createdDate.toLocaleString("pt-BR")}
            </p>
            <div className="items-center gap-2 text-sm lg:flex">
              {order.products.map((product) => (
                <div className="py-2" key={product.id}>
                  <h2 className="py-2">{product.name}</h2>
                  <div className="flex items-baseline gap-4">
                    <Image
                      src={product.image!}
                      alt={product.name}
                      width={36}
                      height={36}
                      className="object-cover"
                    />
                    <p>{formatPrice(product.unit_amount)}</p>
                    <p>Quantity: {product.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="font-medium">Total: {formatPrice(order.amount)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
