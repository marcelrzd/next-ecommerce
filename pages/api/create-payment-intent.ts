import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { AddCartType } from "@/types/AddCartType";
import { prisma } from "@/util/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

const calculateOrderAmount = (items: AddCartType[]) => {
  const totalPrice = items.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity;
  }, 0);
  return totalPrice;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //  get user
  const userSession = await getServerSession(req, res, authOptions);
  if (!userSession?.user) {
    res.status(403).json({ message: "Not logged in" });
    return;
  }
  //   extract data from the body
  const { items, payment_intent_id } = req.body;

  //   create order data
  const orderData = {
    user: { connect: { id: userSession.user?.id } },
    amount: calculateOrderAmount(items),
    currency: "usd",
    status: "pending",
    paymentIntentId: payment_intent_id,
    products: {
      create: items.map((item) => ({
        name: item.name,
        description: item.description || null,
        unit_amount: parseFloat(item.unit_amount),
        quantity: item.quantity,
        image: item.image,
      })),
    },
  };

  // check if the payment intent exists, update the order
  if (payment_intent_id) {
    const currentIntent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );
    if (currentIntent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        {
          amount: calculateOrderAmount(items),
        }
      );
      // fetch order with product ids
      const existing_order = await prisma.order.findFirst({
        where: { paymentIntentId: updated_intent.id },
        include: { products: true },
      });
      if (!existing_order) {
        res.status(400).json({ message: "Invalid Payment Intent" });
      }

      // update existing order
      const updated_order = await prisma.order.update({
        where: { id: existing_order?.id },
        data: {
          amount: calculateOrderAmount(items),
          products: {
            deleteMany: {},
            create: items.map((item) => ({
              name: item.name,
              description: item.description || null,
              unit_amount: parseFloat(item.unit_amount),
              quantity: item.quantity,
              image: item.image,
            })),
          },
        },
      });
      res.status(200).json({ paymentIntent: updated_intent });
      return;
    }
  } else {
    // create new order with prisma
    const payment_intent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    orderData.paymentIntentId = payment_intent.id;
    const newOrder = await prisma.order.create({
      data: orderData,
    });
    res.status(200).json({ payment_intent });
  }
}
