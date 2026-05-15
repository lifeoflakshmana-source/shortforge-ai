import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { amount } = body;

    const order = await razorpay.orders.create({
      amount,
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