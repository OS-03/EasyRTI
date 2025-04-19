import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Footer from "./Footer";
import Navbar from './Navbar';

const ContactUs: React.FC = () => {
    const [showMessage, setShowMessage] = React.useState(false);

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string().email("Invalid email address").required("Email is required"),
            subject: Yup.string().required("Subject is required"),
            message: Yup.string().required("Message is required"),
        }),
        onSubmit: (values, { resetForm }) => {
            console.log(values);
            setShowMessage(true);

            // Scroll to the top of the page with smooth behavior
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            setTimeout(() => setShowMessage(false), 3000); // Hide the message after 3 seconds
            resetForm();
        },
    });

    return (
        <>
        <Navbar/>
        <div className="border border-gray-100 max-w-3xl mx-auto my-auto p-6 shadow-xl rounded-md mt-7 mb-7">
            <div className="mb-6">
                <p className="text-gray-800">
                    If the applicant's query doesn't get resolved through below form or helprtionline-dopt[at]nic[dot]in or 011-24622461,
                    then they may contact below mentioned officials.
                </p>
                <div className="mt-4">
                    <p className="font-bold">O/o.JS (IR)</p>
                    <p>DoPT, Room No.215/C,</p>
                    <p>North Block</p>
                    <p>New Delhi-110001</p>
                    <p>Email: dirrti-dopt[at]nic[dot]in</p>
                </div>
                <div className="mt-4">
                    <p className="font-bold">Under Secretary(IR)</p>
                    <p>Room No.278/A</p>
                    <p>North Block</p>
                    <p>New Delhi-110001</p>
                </div>
            </div>
            {showMessage && (
                <div
                    className="fixed top-24 left-1/2 transform -translate-x-1/2 mt-4 p-4 text-green-800 bg-green-100 border border-green-300 rounded-md shadow-lg animate-fade-in-out z-50 transition-opacity duration-300 ease-in-out"
                >
                    <div className="flex justify-between items-center">
                        <span>Your message has been sent successfully!</span>
                        <button
                            onClick={() => setShowMessage(false)}
                            className="ml-4 text-green-800 hover:text-green-600 focus:outline-none"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h1>
            <form className="space-y-4" onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 block w-full px-4 py-2 border ${
                            formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Your Name"
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 block w-full px-4 py-2 border ${
                            formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Your Email"
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                        Subject
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formik.values.subject}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 block w-full px-4 py-2 border ${
                            formik.touched.subject && formik.errors.subject ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Subject"
                    />
                    {formik.touched.subject && formik.errors.subject && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.subject}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`mt-1 block w-full px-4 py-2 border ${
                            formik.touched.message && formik.errors.message ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Your Message"
                    ></textarea>
                    {formik.touched.message && formik.errors.message && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.message}</p>
                    )}
                </div>
                {formik.isSubmitting ? (
                    <div className="relative group cursor-pointer hover:visible my-5">
                        <div className="invisible absolute -inset-1 bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:visible duration-900 ease-in-out"></div>
                        <button
                            type="submit"
                            className="relative tbtn w-full my-5 p-5 bg-white text-black ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center space-x-6 hover:text-blue-600 dark:text-sky-400"
                        >
                            <svg
                                className="animate-spin h-5 w-5 text-black mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                            <span>Please wait</span>
                        </button>
                    </div>
                ) : (
                    <div className="relative group cursor-pointer hover:visible my-5">
                        <div className="invisible absolute -inset-1 bg-gradient-to-br from-orange-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:visible duration-900 ease-in-out"></div>
                        <button
                            type="submit"
                            className="relative tbtn w-full my-5 p-5 bg-white text-black ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center justify-center space-x-6 hover:text-blue-600 dark:text-sky-400"
                        >
                            Submit
                        </button>
                    </div>
                )}
            </form>
        </div>
        <Footer/>
        </>
    );
};

export default ContactUs;