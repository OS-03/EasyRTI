import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";
import Footer from "../shared/Footer";
import { USER_API_END_POINT } from "../../utils/constant";
import { Loader2 } from "lucide-react";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${USER_API_END_POINT}/forget-password`, { email }, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        toast.success( `Password reset link sent to your email. Redirecting to homepage...`);
        setTimeout(() => {
          window.location.href = '/';
        }, 2000); // Redirect after 2 seconds to allow the user to see the success message
      } else {
        toast.error(res.data.message || "Failed to send reset link.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-2/3 max-w-xl border border-gray-200 shadow-lg rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Forget Password</h1>
          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              required
            />
          </div>
          {loading ? (
            <div className="relative group cursor-pointer hover:visible my-4">
              <div className="invisible absolute -inset-1 bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:visible duration-900 ease-in-out"></div>
              <Button
            type="submit"
            className="relative tbtn w-full my-4 bg-white text-black ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center space-x-6 hover:text-blue-600 dark:text-sky-400"
            disabled
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
            Send Reset Link
              </Button>
            </div>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ForgetPassword;