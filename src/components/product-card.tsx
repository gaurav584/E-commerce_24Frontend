
import { FaPlus } from 'react-icons/fa';
//import { server } from '../redux/store';
import { CartItem } from '../types/types';

const server =  "https://e-commerce-24backend-6.onrender.com";

type ProductsProps = {
    productId:string;
    photo:string;
    name:string;
    price:number;
    stock:number;
    handler:(CartItem:CartItem) => string | undefined
};

const ProductCard = ({
    productId,
    price,
    name,
    photo,
    stock,
    handler,
}:ProductsProps) => {
  return (
    <div className="product-card">
        <img src={`${server}/${photo}`} alt={name} />
        <p>{name}</p>
        <span>${price}</span>

        <div>
            <button onClick={()=>handler({productId,price,name,photo,stock,quantity:1})}>
                <FaPlus/>
            </button>
        </div>
    </div>
  )
}

export default ProductCard;
