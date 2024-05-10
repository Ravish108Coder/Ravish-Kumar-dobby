import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from 'react'
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
function SignUpForm() {
    const SignUpBtnRef = useRef(null);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignUpSubmit = (e) => {
        e.preventDefault();
        const submitBtn = SignUpBtnRef.current;
        const formData = {};
        formData.username = e.target.name.value;
        formData.email = e.target.email.value;
        formData.password = e.target.password.value;
        const fetchdata = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_SERVER}/api/user/register`, {
                    method: 'POST',
                    body: JSON.stringify(formData),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await response.json()
                if (data?.status) {
                    navigate('/signin');
                } else {
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        // loading set and navigate

        fetchdata();
        setName('');
        setEmail('');
        setPassword('');
    }

    return (
        <Card color="transparent" shadow={false}>
            <Typography variant="h4" color="blue-gray">
                Sign Up
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
                Nice to meet you! Enter your details to register.
            </Typography>
            <form onSubmit={handleSignUpSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                <div className="mb-1 flex flex-col gap-6">
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                        Your Name
                    </Typography>
                    <Input
                        disabled={loading}
                        variant="outlined"
                        label="Name"
                        name="name"
                        type="text"
                        size="lg"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required={true}
                    />
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
                        onChange={(e) => setEmail(e.target.value)}
                        size="lg"
                        placeholder="abc@mail.com"
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
                        onChange={(e) => setPassword(e.target.value)}
                        size="lg"
                        placeholder="********"
                        required={true}
                    />
                </div>

                <Button loading={loading} ref={SignUpBtnRef} type="submit" className="mt-6" fullWidth>
                    sign up
                </Button>
                {
                    !loading && (
                        <Typography color="gray" className="mt-4 text-center font-normal">
                            Already have an account?{" "}
                            <Link to={'/signin'} className="font-medium text-gray-900">
                                Sign In
                            </Link>
                        </Typography>
                    )
                }

            </form>
        </Card>
    );
}

const SignUp = () => {
    return (
        <div className='w-screen h-screen flex items-center justify-center'>
            <SignUpForm />
        </div>
    )
}

export default SignUp