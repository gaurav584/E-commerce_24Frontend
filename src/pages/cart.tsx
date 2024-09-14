import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../components/cart-item";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import { addToCart, calculatePrice, discountApplied, removeCartItem } from "../redux/reducer/cartReducer";
import axios from "axios";
//import { server } from "../redux/store";

const Cart = () => {

  const server = "http://localhost:4000";

  // getting cart Array from store
  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );

  const dispatch = useDispatch();

  const [couponCode, setCoupenCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  {
    /* if we want to add quantity -> first find that index in array than incresses*/
  }
  const incrementHandler = (cartItem: CartItem) => {
    if(cartItem.quantity >= cartItem.stock) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };

  const decrementHandler = (cartItem: CartItem) => {
    if(cartItem.quantity <=1) return;
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };

  const removeHandler = (productId:string) => {
    dispatch(removeCartItem(productId));
  };

  // logic for coupon-validation
  useEffect(()=>{

    const {token:cancelToken,cancel} = axios.CancelToken.source();

    const timeOutId = setTimeout(()=>{
       axios.get(`${server}/api/v1/payment/discount?coupon=${couponCode}`,{cancelToken})
       .then((res)=>{ 
        dispatch(discountApplied(res.data.discount));
        console.log(res.data);
        setIsValidCouponCode(true);
       }).catch(()=>{
        dispatch(discountApplied(0));
        cancel();
        setIsValidCouponCode(false);
       })
    },1000);

    return () => {
      clearTimeout(timeOutId);
      setIsValidCouponCode(false);
    }
  },[couponCode])

  // code for cart price total
  useEffect(()=>{
    dispatch(calculatePrice());
  },[cartItems]);


  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i, idx) => (
            <CartItemCard
              key={idx}
              cartItem={i}
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
            />
          ))
        ) : (
          <h1>No item Added</h1>
        )}
      </main>
      <aside>
        <p>SubTotal: ${subtotal}</p>
        <p>Shipping Charges: ${shippingCharges}</p>
        <p>Tax: ${tax}</p>
        <p>
          Discount: <em>- ${discount}</em>
        </p>
        <p>
          <b>Total: ${total}</b>
        </p>
        <input
          type="text"
          placeholder="Coupon code"
          value={couponCode}
          onChange={(e) => setCoupenCode(e.target.value)}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ${discount} off using the <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon <VscError />
            </span>
          ))}

        {cartItems.length > 0 && <Link to="/shipping">Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
