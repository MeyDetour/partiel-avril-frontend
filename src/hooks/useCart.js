export default function useCart() {

    function removeElementToCart(id) {
        const currentCart = JSON.parse(localStorage.getItem("cartList")) || [];
        for (let elt of currentCart) {
            if (elt.id === id) {
                elt["quantity"] -= 1
                if (elt["quantity"] === 0) {
                    currentCart.splice(currentCart.indexOf(elt), 1)
                }
                break
            }
        }
        localStorage.setItem("cartList", JSON.stringify(currentCart));
        return currentCart;
    }

    function addElementToCart(elementToAdd) {
        const currentCart = JSON.parse(localStorage.getItem("cartList")) || [];

        let isThereThisElemetInCart = false;
        for (let elt of currentCart) {
            if (elt.id === elementToAdd.id) {
                isThereThisElemetInCart = true;
                elt["quantity"] += 1
                break
            }
        }
        if (!isThereThisElemetInCart) {
            currentCart.push({...elementToAdd, quantity: 1});
        }

        localStorage.setItem("cartList", JSON.stringify(currentCart));
        return currentCart;
    }
    function emptyCart(){
        localStorage.removeItem("cartList");
    }
    return {removeElementToCart,addElementToCart,emptyCart};
}
