import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/servers/utils/AuthContext";
import { PersonStanding } from "lucide-react";

const SignUp = () => {
  //state
  const { login } = useAuth()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate()

  const validateUser = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/login/signup`,
      {
        email,
        password,
        name: username
      }
    );
    if (response.status === 201) {
      const token = response.data.access_token;
      login(token);
      navigate('/')
    } else {
      alert(response.data.message)
    }
  };

  //function
  return (
    <>
      <div className="h-screen flex w-full bg-black  justify-center">
        <div className="flex justify-center md:w-1/2 w-full rounded-lg overflow-hidden">
          <div className="bg-gray-900 items-center md:w-2/2 md:h-2/3 w-full  md:my-auto rounded-l-3xl">
            <div className=" flex flex-col items-center w-full h-full p-3 justify-center ">
              <div className="mb-3">
                <h1 className="text-2xl text-center mb-3 font-bold">Howdy!</h1>
                <p className="mb-2">Please fill out your details</p>
              </div>
              <div className="mb-3">
                <label className="input input-bordered flex items-center gap-2">
                  <PersonStanding />
                  <input type="text" onChange={(e) => { setUsername(e.target.value) }} className="grow" placeholder="Username" />
                </label>

              </div>
              <div className="mb-3">
                <label className="input input-bordered flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                      d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path
                      d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                  <input type="text" onChange={(e) => { setEmail(e.target.value) }} className="grow" placeholder="Email" />
                </label>

              </div>
              <div>
                <label className="input input-bordered flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4 opacity-70">
                    <path
                      fillRule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                      clipRule="evenodd" />
                  </svg>
                  <input type="password" onChange={(e) => { setPassword(e.target.value) }} className="grow" placeholder="Password" />
                </label>

              </div>
              <div className="flex justify-center mt-6">
                <button onClick={validateUser} className="relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
                  <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
                  <span className="relative text-white">Register</span>
                </button>

              </div>

            </div>
          </div>



          <div className="md:flex hidden relative items-center justify-center w-full h-2/3 my-auto bg-gradient-to-r from-red-500 to-pink-500 rounded-r-3xl">
            <p className="text-9xl text-black z-20 animate-moveUp">V</p>

            <p className="absolute text-7xl text-black ml-1 ">
              Monitor
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default SignUp;
