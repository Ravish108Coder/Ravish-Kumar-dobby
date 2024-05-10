import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignInSubmit = (e) => {
        setLoading(true);
        e.preventDefault();
        const formData = {};
        formData.email = e.target.email.value;
        formData.password = e.target.password.value;
        const fetchdata = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER}/api/user/login`, {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                })
                const data = await response.json()
                if (data?.status) {
                    setEmail('');
                    setPassword('');
                    localStorage.setItem('token', data?.token);
                    navigate('/');
                } else {
                    setPassword('');
                }
                setLoading(false);
            } catch (error) {
                setEmail('');
                setPassword('');
                setLoading(false);
            }
        }

        // loading set and navigate

        fetchdata();

    }
    return (
        <Card color="transparent" shadow={false}>
            <Typography variant="h4" color="blue-gray">
                Sign In
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
                Welcome Back! Enter your details to Sign In.
            </Typography>
            <form onSubmit={handleSignInSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                <div className="mb-1 flex flex-col gap-6">
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Your Email
                    </Typography>
                    <Input
                        disabled={loading}
                        variant="outlined"
                        label="Email"
                        name="email"
                        type="email"
                        value={email}
                        placeholder="abc@email.com"
                        size="lg"
                        onChange={(e) => setEmail(e.target.value)}
                        required={true}
                    />
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Password
                    </Typography>
                    <Input
                        disabled={loading}
                        variant="outlined"
                        label="Password"
                        name="password"
                        value={password}
                        type={showPassword ? "text" : "password"}
                        icon={
                            !showPassword ?
                                <svg onClick={() => setShowPassword(prev => !prev)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="cursor-pointer w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                :
                                <svg onClick={() => setShowPassword(prev => !prev)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="cursor-pointer w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                        }
                        placeholder="********"
                        size="lg"
                        onChange={(e) => setPassword(e.target.value)}
                        required={true}
                    />
                </div>



                <Button loading={loading} type="submit" className="mt-6" fullWidth>
                    sign in
                </Button>
                {
                    !loading && (
                        <Typography color="gray" className="mt-4 text-center font-normal">
                            Don't have an account?{" "}
                            <Link to={'/signup'} className="font-medium text-gray-900">
                                Sign Up
                            </Link>
                        </Typography>
                    )
                }

            </form>
        </Card>
    );
}

const SignIn = () => {
    return (
        <div className='w-screen h-screen flex items-center justify-center'>
            <SignInForm />
        </div>
    )
}

export default SignIn