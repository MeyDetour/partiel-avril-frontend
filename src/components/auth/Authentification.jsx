import {useEffect, useState} from "react";
import {useForm} from "react-hook-form"
import "./style.css"
import {useNavigate} from "react-router";

export default function Authentification() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();
    const [formName, setFormName] = useState("login")
    const [formError, setFormError] = useState("")
    const navigate = useNavigate();

    // DENY ACCESS TO CONNECTED USER
    useEffect(() => {
        if (localStorage.getItem("token")) {
            return navigate("/scan")
        }
    }, [formName, formError, navigate]);


    async function submitAndLogin(data) {
        const res = await fetch(import.meta.env.VITE_URL + "api/login_check", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const resJSON = await res.json()
        if (resJSON.token) {
            localStorage.setItem("token", resJSON.token)
            return navigate("/scan")
        } else {
            setFormError("Failed to login")
        }
    }

    async function submitAndRegister(data) {
        console.log(data)
        const res = await fetch(import.meta.env.VITE_URL + "api/register", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const resJSON = await res.json()
        if (resJSON.id) {
            setFormName("login")
        }
        if (resJSON.message) {
            setFormError(resJSON.message)
        }
    }

    return (
        formName === "login" ?

            //  LOGIN FORM
            <form method="post" className={"authForm"} onSubmit={handleSubmit(submitAndLogin)}>
                <h1>Log in !</h1>

                {formError && (<span className={"error md-text"}>{formError}</span>)}
                {errors.email && (<span className={"error md-text"}>{errors.email.message}</span>)}
                {errors.password && (<span className={"error md-text"}>{errors.password.message}</span>)}
                <label>
                    Email
                    <input className="inputDiv"
                           placeholder="Email"
                           defaultValue={"mey@gmail.com"}
                           {...register("username", {
                               pattern: {
                                   value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                   message: "Invalid email address",
                               },
                           })}
                    >
                    </input>
                </label>
                <label>
                    Password
                    <input className="inputDiv"
                           placeholder="Password"
                           type={"password"}
                           defaultValue={"AtsEGRuY^Uun9@!h"}
                           {...register("password", {
                               required: true,
                           })}
                    >
                    </input>
                </label>
                <button className="basicButton" type="submit" value="Submit">Submit</button>
                <span className={"link"} onClick={() => setFormName("register")}>Create Account</span>
            </form>
            :

            // REGISTER FORM
            <form method="post" className={"authForm"} onSubmit={handleSubmit(submitAndRegister)}>
                <h1> Register ! </h1>
                {formError && (<span className={"error md-text"}>{formError}</span>)}
                {errors.email && (<span className={"error md-text"}>{errors.email.message}</span>)}
                {errors.password && (<span className={"error md-text"}>{errors.password.message}</span>)}
                <label>
                    Email
                    <input className="inputDiv"
                           placeholder="Email"
                           defaultValue={"mey@gmail.com"}
                           {...register("email", {
                               pattern: {
                                   value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                   message: "Invalid email address",
                               },
                           })}
                    >

                    </input>
                </label>


                <label>
                    Password
                    <input className="inputDiv"
                           placeholder="Password"
                           type={"password"}
                           defaultValue={"AtsEGRuY^Uun9@!h"}
                           {...register("password", {
                               required: true,
                           })}
                    >

                    </input>
                </label>

                <button className="basicButton" type="submit" value="Submit">Submit</button>
                <span className={"link"} onClick={() => setFormName("login")}>Log in app</span>
            </form>
    )
}
