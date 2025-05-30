import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useNavigate, Link } from "react-router-dom";
import { useState, useContext } from "react";
import {  AuthContext } from "@/context/authContext";

console.log('Im in sign-in.jsx')

export function SignIn() {
  const { login } = useContext(AuthContext); // Manage Login in the AuthContext file

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Im in handleSubmit inside sign-in.jsx')
    console.log("Sending data to authRoute for login function",email,password)
    try {
      const response = await fetch(`http://localhost:5000/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      // Read JSON once
      const data = await response.json();
      console.log("Receiving data from authRoute:", data);

      if (!response.ok) {
        throw new Error(data.msg || "User sign-in failed");
      }

      if (data) {
        console.log("User sign-in successful:", data);
        login({ user: data.user }); // Pass both token and user to the login function
        navigate(data.redirectTo); // Redirect to the appropriate page based on user role

      } else {
        console.error("Invalid response: Missing token or user data.");
      }

    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <section className="h-screen w-screen overflow-hidden flex">
      <div className="w-full lg:w-3/5 mt-24 ">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button type="submit" className="mt-6" fullWidth>
            Sign In
          </Button>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">Create account</Link>
          </Typography>
        </form>
      </div>
      <div className="w-1/2 hidden lg:block flex items-center justify-center">
        <img
          src="/img/signInImage.jpg"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}

export default SignIn;
