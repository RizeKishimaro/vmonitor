import axios from "axios";
import { useState } from "react";

const Login = () => {
  //state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateUser = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/login`,
      {
        email,
        password,
      }
    );
    const token = response.data.access_token;
    localStorage.setItem("access_token", token);
    const access_token = localStorage.getItem("access_token");
    alert(`Your Token is ${access_token}`);
  };

  //function
  return (
    <>
      <div className="h-screen flex bg-amber-300">
        <div className="bg-amber-200  items-center p-3 w-2/6 mx-auto my-auto h-2/3 ">
          <div className="flex flex-col text-center">
            <h1 className="text-2xl font-bold mt-5">Welcome!</h1>
            <p className="text-2xl mt-2">Please login to Continue</p>
          </div>
          <div className="flex flex-col items-center mt-5">
            <div>
              <p className="mt-1">Email</p>
              <input
                type="text"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="input input-bordered w-full h-9 max-w-xs mt-3"
              />
            </div>
            <div>
              <p className="mt-2">Password</p>
              <input
                type="text"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="input input-bordered w-full h-9 max-w-xs mt-2"
              />
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={validateUser}
              className="btn btn-outline btn-warning"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
