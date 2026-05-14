import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
  try {
    const order = await razorpay.orders.create({
      amount: 9900,
      currency: "INR",
      receipt: "receipt_order",
    });

    return Response.json(order);
  } catch (error) {
    console.log(error);

    return Response.json({
      error: "Payment failed",
    });
  }
}