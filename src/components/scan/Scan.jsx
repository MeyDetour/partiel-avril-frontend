import {useNavigate} from "react-router";

import {Html5QrcodeScanner} from "html5-qrcode";
import {useEffect, useState} from "react";
import "./style.css"
import Loader from "../loader/Loader.jsx";
import {Link} from "react-router-dom";
import useCart from "../../hooks/useCart.js";

export default function Scan() {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [cartList, setCartList] = useState(JSON.parse(localStorage.getItem('cartList')) || [])
    const {removeElementToCart, addElementToCart, emptyCart} = useCart()

    //use scanner globally to avoid two render
    let scanner


    useEffect(() => {

            //render scanner if no scanner and app no loading
            if (!scanner?.getState() && !loading) {
                //get proportionate width
                let div = document.querySelector(".center")
                const qrboxWidth = div.getBoundingClientRect().width - 30;

                //https://www.youtube.com/watch?v=feKw5BQmKIs
                scanner = new Html5QrcodeScanner('reader', {
                    qrbox: {width: qrboxWidth, height: 200,}, fps: 5
                }, undefined)
                scanner.render(success, error)

                async function success(result) {
                    scanner.clear()

                    // fetch product scanned
                    const response = await fetch(import.meta.env.VITE_URL + "api/product/" + result, {
                        method: 'GET',
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

                        setLoading(true)
                        return

                    }
                    const resJSON = await response.json()

                    //if we get product, add it to cart
                    if (resJSON.id) {
                        const newCart = addElementToCart(resJSON)
                        setCartList([...newCart]);
                        setLoading(true)
                    } else {

                        setLoading(true)
                    }
                }

                function error(err) {
                    if (err.search("NotFoundException") === -1) {
                        console.warn("QR Code Error:", err);
                    //    setError("QR Code Error:" + err);
                    }
                }
            }

        }
        ,
        [navigate, addElementToCart, error]
    )

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            return navigate("/")
        }
    }, [cartList, navigate]);
    useEffect(() => {
        if (loading) {
            setTimeout(() => {
                setLoading(false)
                setError(null)
            }, 1500)
        }
    }, [loading])

    console.log(loading)
    console.log(scanner)
    console.log(error)

    return (
        <>
            <div className={"scanPage"}>

                <div className={"itemsInCart"}>
                    {cartList && cartList.length > 0 ?
                        cartList.map((item, index) => (
                            <div key={index} onClick={() => setCartList(removeElementToCart(item.id))}
                                 className={"item"}>
                                <span>{item.name} {item.price}€</span>
                                <div className={"imageContainer"}>
                                    {item.quantity > 1 && <span>{item.quantity}</span>}
                                    <img src={item.imageUrl} alt=""/>
                                </div>
                            </div>


                        ))
                        : null
                    }

                </div>
                <div className={"container"}>
                    <div className={"center"}>
                        {error && <div className="error">{error}</div>}
                        {loading ? Loader() : <div id={"reader"}></div>}

                    </div>

                    <nav>
                        {cartList.length > 0 &&
                            <>
                                <Link to={"/pay/cart"} className={"basicButton"}>Valider panier</Link>
                                <span onClick={() => {
                                    if (window.confirm("are you sure ?")) {
                                        emptyCart()
                                        setCartList([])
                                    }
                                }} className={"basicButton"}>Vider le panier</span>
                            </>
                        }
                        <Link to={"/history"} className={"basicButton"}>History</Link>

                    </nav>
                </div>

            </div>
        </>

    )
}
