import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        setIsLoading(true);
        dispatch(login(data.email, data.password));
        setIsLoading(false);
    };

    return (
        <div>
            <h2>Login Page</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Email:</label>
                    <input type="email" {...register("email", { required: "Email is required" })} />
                    {errors.email && <span>{errors.email.message}</span>}
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" {...register("password", { required: "Password is required" })} />
                    {errors.password && <span>{errors.password.message}</span>}
                </div>
                {isLoading ? <p>...Loading</p> : <button type="submit">Login</button>}
            </form>
        </div>
    );
}

export default LoginPage;
