import React from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../../redux/authSlice";
import { Loader2 } from "lucide-react";
import Footer from "../shared/Footer";
import { USER_API_END_POINT } from '../../utils/constant';
import { useFormik } from "formik";
import * as Yup from "yup";

const Signin = () => {
  const { loading, user } = useSelector(
    (store: { auth: { loading: boolean; user: any } }) => store.auth
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      role: Yup.string().oneOf(["citizen", "government"], "Role is required").required("Role is required"),
    }),
    onSubmit: async (values) => {
      try {
        dispatch(setLoading(true));
        const res = await axios.post(`${USER_API_END_POINT}/signin`, values, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUser(res.data.user));
          navigate("/");
          toast.success(res.data.message);
        }
      } catch (err: any) {
        console.log(err);
        toast.error(err.response.data.message);
      } finally {
        dispatch(setLoading(false));
      }
    },
  });

  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={formik.handleSubmit}
          className="w-2/3 max-w-xl  border border-gray-200 shadow-lg rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">SignIn</h1>
          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              {...formik.getFieldProps("email")}
              placeholder="JohnDoe123@gmail.com"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              {...formik.getFieldProps("password")}
              placeholder="*******"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            ) : null}
          </div>

          <div className="block mb-3">
            <div className="flex flex-col">
              <div className="flex">
                <Input
                  type="radio"
                  id="role1"
                  name="role"
                  value="citizen"
                  checked={formik.values.role === "citizen"}
                  onChange={formik.handleChange}
                  className="hidden"
                />
                <label
                  htmlFor="role1"
                  className={`flex pr-10 items-center cursor-pointer p-2 mb-3 rounded-md ${
                    formik.values.role === "citizen"
                      ? "bg-gray-100 border border-indigo-500"
                      : "hover:bg-gray-100 border border-transparent"
                  }`}
                >
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
                  <span className="ml-2 text-sm font-medium flex items-center">
                    Citizen
                  </span>
                </label>
              </div>
              <div className="flex">
                <Input
                  type="radio"
                  id="role2"
                  name="role"
                  value="government"
                  checked={formik.values.role === "government"}
                  onChange={formik.handleChange}
                  className="hidden"
                />
                <label
                  htmlFor="role2"
                  className={`flex items-center cursor-pointer p-2 rounded-md ${
                    formik.values.role === "government"
                      ? "bg-gray-100 border border-indigo-500"
                      : "hover:bg-gray-100 border border-transparent"
                  }`}
                >
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
                  <span className="ml-2 text-sm font-medium flex items-center">
                    Government
                  </span>
                </label>
              </div>
            </div>
            {formik.touched.role && formik.errors.role ? (
              <div className="text-red-500 text-sm">{formik.errors.role}</div>
            ) : null}
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
          <div className="flex w-100 justify-between">
            <span className="text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="btn text-blue-600">
                Signup
              </Link>
            </span>
            <span className="text-sm">
              Forget Password?{" "}
              <Link to="/forget-password" className="btn text-blue-600">
                new password
              </Link>
            </span>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Signin;


