import "./style.css"
import {useState} from "react";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";
import Loader from "../loader/Loader.jsx";
import useCart from "../../hooks/useCart.js";

export default function PayCart() {
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [cartList, setCartList] = useState(JSON.parse(localStorage.getItem('cartList')) || [])
    const {removeElementToCart} = useCart()

    async function validCart() {
        //CREATE ORDER SIMULATON OF PAYMENT
        const response = await fetch(import.meta.env.VITE_URL + "api/order/new", {
            method: 'POST',
            body: JSON.stringify( {products:cartList.map((item) => ({id:item.id,quantity:item.quantity}))}),
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        if (response.status === 401) {
            localStorage.removeItem("token");
            return navigate("/")
        }
        if (!response.ok) {
            const errorResponse = await response.json().catch(() => null);
            setError(errorResponse?.message || "HTTP error! Status:" + errorResponse.status);
            return

        }
        const resJSON = await response.json()

        //if we get order, add it to cart
        if (resJSON.id) {
            localStorage.removeItem("cartList");
            return navigate("/scan")
        } else {
            setLoading(true)
        }
    }

    return (
        <>
            <div className="container validPage">
                {error && <div className="error">{error}</div>}

                {
                    loading ?
                        <Loader/>
                        :
                        <>  <Link to={"/scan"} className={"basicButton"}>Scanner encore</Link>
                            <div className={"itemsToValidCart"}>
                                {cartList && cartList.length > 0 ?
                                    cartList.map((item, index) => (
                                        <div key={index} onClick={() => setCartList(removeElementToCart(item.id))}
                                             className={"item"}>
                                            <img src={item.imageUrl} alt=""/>
                                            <div className={"textContainer"}>
                                                <span><b>{item.name}</b></span>
                                                <span>Price : {item.price}€</span>
                                                <span>Quantity : {item.quantity}</span>
                                            </div>
                                        </div>


                                    ))
                                    : null
                                }

                            </div>
                            <button onClick={()=>validCart()}>Payer</button>
                        </>

                }

            </div>

        </>

    )
}
