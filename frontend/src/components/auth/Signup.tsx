import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/authSlice";
import { Loader2 } from "lucide-react";
import Footer from "../shared/Footer";
import { useFormik } from "formik";
import * as Yup from "yup";

const Signup = () => {
  const { loading, user } = useSelector(
    (store: { auth: { loading: boolean; user: any } }) => store.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "",
      governmentEmployeeNumber: "",
      file: null,
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      phoneNumber: Yup.string().required("Phone number is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      role: Yup.string().required("Role is required"),
      governmentEmployeeNumber: Yup.string().when("role", {
        is: (role: string) => role === "government",
        then: () => Yup.string().required("Government employee number is required"),
        otherwise: () => Yup.string(),
      }),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "file" && value) {
          formData.append(key, value as unknown as File);
        } else {
          formData.append(key, value as string);
        }
      });

      // Add default profile picture if no file is selected
      if (!values.file) {
        try {
          const response = await fetch("/defaultuser.jpg"); // Ensure this path is correct and accessible
          if (!response.ok) {
            throw new Error("Failed to fetch default profile picture");
          }
          const blob = await response.blob();
          formData.append("file", blob, "default-profile-picture.jpg");
        } catch (error) {
          console.error("Failed to fetch default profile picture:", error);
          return toast.error("Failed to load default profile picture. Please try again.");
        }
      }

      try {
        dispatch(setLoading(true));
        const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        if (res.data.success) {
          navigate("/signin");
          toast.success(res.data.message);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Something went wrong");
      } finally {
        dispatch(setLoading(false));
      }
    },
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center mx-auto">
        <form
          onSubmit={formik.handleSubmit}
          className="w-2/3 max-w-xl  border border-gray-200 shadow-lg rounded-md p-6 my-10"
        >
          <h1 className="font-bold text-2xl mb-5 ">Sign Up</h1>
          <div className="mb-4">
            <Label>Full Name</Label>
            <Input
              type="text"
              name="fullname"
              value={formik.values.fullname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="John Doe"
            />
            {formik.touched.fullname && formik.errors.fullname && (
              <p className="text-red-500 text-sm">{formik.errors.fullname}</p>
            )}
          </div>
          <div className="mb-4">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="JohnDoe123@gmail.com"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <Label>Phone Number</Label>
            <Input
              type="text"
              name="phoneNumber"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="9999999999"
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <p className="text-red-500 text-sm">{formik.errors.phoneNumber}</p>
            )}
          </div>
          <div className="mb-4">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="********"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
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
                  className={`flex pr-10 items-center cursor-pointer p-2 mb-3 rounded-md ${formik.values.role === "citizen"
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
                  className={`flex items-center cursor-pointer p-2 rounded-md ${formik.values.role === "government"
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
            {formik.values.role === "government" && (
              <div className="mb-4">
                <Label>Government Employee Number</Label>
                <Input
                  type="text"
                  name="governmentEmployeeNumber"
                  value={formik.values.governmentEmployeeNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter your government employee number"
                />
                {formik.touched.governmentEmployeeNumber && formik.errors.governmentEmployeeNumber && (
                  <p className="text-red-500 text-sm">{formik.errors.governmentEmployeeNumber}</p>
                )}
              </div>
            )}
          </div>

            <div className="mb-4">
            <Label>Profile Picture</Label>
            <Input
              type="file"
              name="file"
              accept="image/*"
              onChange={(e) => formik.setFieldValue("file", e.currentTarget.files?.[0] || null)}
            />
            {!formik.values.file && (
              <p className="text-gray-500 text-sm mt-2">
              A default profile picture will be used if none is selected.
              </p>
            )}
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
                Signup
              </Button>
            </div>
          )}
          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-600">
              Signin
            </Link>
          </p>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
