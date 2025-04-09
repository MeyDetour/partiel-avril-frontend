import "./style.css"
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";
import Loader from "../loader/Loader.jsx";

export default function History() {
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [ordersList, setOrdersList] = useState([])
    const [oneOrder, setOneOrder] = useState(null)
    useEffect(() => {
        async function fetchData() {
            // GET ALL ORDER
            const response = await fetch(import.meta.env.VITE_URL + "api/order/history", {
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
                return

            }
            const resJSON = await response.json()
            setOrdersList(resJSON)
            setLoading(false)
        }

        if (ordersList.length === 0 && !error) fetchData()
    }, [loading, error, navigate])

    function countProducts(order) {
        let count = 0;
        for (let item of order.productsItems) {
            count += item.quantity
        }
        return count;
    }

    function countPrice(order) {
        let count = 0;
        for (let item of order.productsItems) {
            count += item.quantity * item.product.price
        }
        return count;
    }

    return (
        <>
            <div className="container historyPage">
                {error && <div className="error">{error}</div>}
                {
                    loading ?
                        <Loader/>
                        :
                        oneOrder ?

                            // ONE ORDER PAGE
                            <>
                                <span onClick={() => setOneOrder(null)} className={"basicButton"}>Return to list</span>
                                <div className={"oneOrderContainer"}>
                                    <h3><b>Order #{oneOrder.id}</b></h3>
                                    {() => {
                                        let date = new Date(oneOrder.createdAt)
                                        date = date.getDate() + "." + date.getMonth() + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes()
                                        console.log(date)
                                        return <span>{date}</span>
                                    }}
                                    <span>Quantity : {countProducts(oneOrder)}</span>
                                    <span>Price : {countPrice(oneOrder)}€</span>
                                    <div className={"oneOrderProductsContainer"}>
                                        {oneOrder.productsItems && oneOrder.productsItems.length > 0 && (
                                            oneOrder.productsItems.map((item, index) => (
                                                <div key={index} className={"oneOrderOneProductContainer"}>
                                                    <img src={item.product.imageUrl} alt=""/>
                                                    <div className={"textContainer"}>
                                                        <span><b>{item.product.name}</b></span>
                                                        <span>Price : {item.product.price}€</span>
                                                        <span>Quantity : {item.quantity}</span>
                                                    </div>

                                                </div>
                                            ))
                                        )}
                                    </div>


                                </div>
                            </>

                            :

                            // ALL ORDER PAGE
                            <>
                                <Link to={"/scan"} className={"basicButton"}>Scanner encore</Link>

                                <div className={"ordersContainer"}>
                                    {ordersList && ordersList.length > 0 ?
                                        ordersList.map((order, index) => {
                                                let date = new Date(order.createdAt)
                                                date = date.getDate() + "." + date.getMonth() + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes()
                                                console.log(date)
                                                return (
                                                    <div onClick={() => setOneOrder(order)} key={index} className={"order"}>
                                                        <span><b>Order #{order.id}</b> </span>
                                                        <span>{date}</span>
                                                        <span>Quantity : {countProducts(order)}</span>
                                                        <span>Price : {countPrice(order)}€</span>
                                                    </div>
                                                )
                                            }
                                        )
                                        : null
                                    }     {ordersList.length === 0 && <span>No order</span>}


                                </div>
                            </>

                }

            </div>

        </>

    )
}
