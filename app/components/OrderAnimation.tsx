import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import order from "@/public/order-received.json";

export default function OrderAnimation() {
  return (
    <div className="flex flex-col items-center justify-center mt-24">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Prepping your order
      </motion.h1>
      <Player autoplay loop src={order}></Player>
    </div>
  );
}
