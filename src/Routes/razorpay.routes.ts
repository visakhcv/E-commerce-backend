import { Router, Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from 'crypto';

const razorpayRouter = Router();

razorpayRouter.post('/orders', async (req: Request, res: Response) => {
    try {
        const instance = new Razorpay({
            key_id: "rzp_test_q27BBAiLTtpTLX" as string,
            key_secret: "gWibVQk0veFSLmRel3i7zcVu" as string
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex")
        };

        instance.orders.create(options, (error: any, order: any) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something went wrong" });
            }
            res.status(200).json({ data: order });
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

razorpayRouter.post('/verify', async (req: Request, res: Response) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSign = crypto
            .createHmac("sha256", "gWibVQk0veFSLmRel3i7zcVu" as string)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent" });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default razorpayRouter;