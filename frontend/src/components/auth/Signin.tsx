import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/authSlice";
import { setUser } from "../../redux/authSlice";
import { Loader2 } from "lucide-react";
import Footer from "../shared/Footer";
import { USER_API_END_POINT } from '../../utils/constant';



const Signin = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const { loading, user } = useSelector(
    (store: { auth: { loading: boolean; user: any } }) => store.auth
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        dispatch(setLoading(true));
        const res = await axios.post(`${USER_API_END_POINT}/signin`, input, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true,
        });
        if (res.data.success) {
            dispatch(setUser(res.data.user));
            navigate("/");
            toast.success(res.data.message);
        }
    } catch (err:any) {
        console.log(err);
        toast.error(err.response.data.message);
    } finally {
        dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">SignIn</h1>
          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="JohnDoe123@gmail.com"
            />
          </div>

          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="*******"
            />
          </div>
          <div className="flex justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Input
                  type="radio"
                  id="role1"
                  name="role"
                  value="citizen"
                  checked={input.role === "citizen"}
                  onChange={changeEventHandler}
                  className="hidden"
                />
                <label
                  htmlFor="role1"
                  className={`flex items-center cursor-pointer ${
                    input.role === "citizen" ? "text-blue-500" : "text-gray-700"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      input.role === "citizen"
                        ? "fill-blue-500"
                        : "fill-gray-300"
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    {input.role === "citizen" && (
                      <circle cx="12" cy="12" r="6" fill="white" />
                    )}
                  </svg>
                  <span className="ml-2 text-sm font-medium flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 11v10m0-10c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z"
                      />
                    </svg>
                    Citizen
                  </span>
                </label>
              </div>
              <div className="flex items-center">
                <Input
                  type="radio"
                  id="role2"
                  name="role"
                  value="government"
                  checked={input.role === "government"}
                  onChange={changeEventHandler}
                  className="hidden"
                />
                <label
                  htmlFor="role2"
                  className={`flex items-center cursor-pointer ${
                    input.role === "government"
                      ? "text-blue-500"
                      : "text-gray-700"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      input.role === "government"
                        ? "fill-blue-500"
                        : "fill-gray-300"
                    }`}
                    viewBox="0 0 24 24"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="5" />
                    {input.role === "government" && (
                      <rect x="8" y="8" width="8" height="8" fill="white" />
                    )}
                  </svg>
                  <span className="ml-2 text-sm font-medium flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10h18M9 21V10m6 11V10M5 6h14M7 3h10"
                      />
                    </svg>
                    GovEmployee
                  </span>
                </label>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="relative group cursor-pointer hover:visible my-4">
              <div className="invisible absolute -inset-1 bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:visible duration-900 ease-in-out"></div>
              <Button
                type="submit"
                className="relative tbtn w-full my-4 bg-white text-black ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center space-x-6 hover:text-blue-600 dark:text-sky-400"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            </div>
          ) : (
            <div className="relative group cursor-pointer hover:visible my-4">
              <div className="invisible absolute -inset-1 bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:visible duration-900 ease-in-out"></div>
              <Button
                type="submit"
                className="relative tbtn w-full my-4 bg-white text-black ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center space-x-6 hover:text-blue-600 dark:text-sky-400"
              >
                Signin
              </Button>
            </div>
          )}
          <span className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="btn text-blue-600">
              Signup
            </Link>
          </span>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Signin;


