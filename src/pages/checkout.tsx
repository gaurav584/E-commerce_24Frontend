import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/orderApi";
import { NewOrderRequest } from "../types/api-types";
import toast from "react-hot-toast";
import { resetCart } from "../redux/reducer/cartReducer";
import { responseToast } from "../utils/feature";
import { RootState } from "../redux/store";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state: RootState) => state.userReducer);

    const {
        shippingInfo,
        cartItems,
        subtotal,
        tax,
        discount,
        shippingCharges,
        total,
    } = useSelector((state: RootState) => state.cartReducer);

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const [newOrder] = useNewOrderMutation();

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        const orderDetails: NewOrderRequest = {
            shippingInfo,
            orderItems: cartItems,
            subtotal, // Ensure this matches the type definition in NewOrderRequest
            tax,
            discount,
            shippingCharges,
            total,
            user: user?._id || "", // Provide a default value if user._id is undefined
        };
        
        const { paymentIntent, error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.origin },
            redirect: "if_required",
        });

        if (error) {
            setIsProcessing(false);
            return toast.error(error.message || "Something went wrong");
        }

        if (paymentIntent?.status === "succeeded") {
            const res = await newOrder(orderDetails);
            dispatch(resetCart());
            responseToast(res, navigate, "/orders");
        }

        setIsProcessing(false);
    };

    return (
        <div className="checkout-container">
            <form 
            className="checkout-form"
            onSubmit={submitHandler}>
                <PaymentElement />
                <button 
                    className="payment_button"
                    type="submit" disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Pay"}
                </button>
            </form>
        </div>
    );
};

const Checkout = () => {
    const location = useLocation();

    // Get the clientSecret from the location's state
    const clientSecret: string | undefined = location.state;

    // If clientSecret is not available, redirect to shipping page
    if (!clientSecret) return <Navigate to="/shipping" />;

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
        </Elements>
    );
};

export default Checkout;
