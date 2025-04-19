import React, { useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

const FAQ: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "What is EasyRTI?",
            answer:
                "EasyRTI is an AI and ML-powered platform designed to automate the process of filing and managing Right to Information (RTI) applications. We aim to make public information accessible, promote transparency in governance, and provide intelligent insights.",
        },
        {
            question: "How does EasyRTI work?",
            answer:
                "Our platform leverages AI and ML to provide a seamless interface for drafting, submitting, and tracking RTI applications. It also includes features like automated response summarization and intelligent recommendations to enhance user experience.",
        },
        {
            question: "Is EasyRTI free to use?",
            answer:
                "Yes, EasyRTI offers free access to its core features. However, additional premium services, such as advanced analytics and priority support, may be available for advanced users.",
        },
        {
            question: "How can I track my RTI application?",
            answer:
                "Once you submit an RTI application through EasyRTI, you can track its status directly from your dashboard. Our AI-powered system also provides real-time updates and summaries of responses.",
        },
        {
            question: "What other features does EasyRTI offer?",
            answer:
                "EasyRTI includes features like automated response summarization, intelligent insights, and machine learning-driven recommendations to simplify and enhance the RTI process.",
        },
    ];

    return (
        <>
        <Navbar/>
        <div className="w-100 bg-gray-100 flex items-center justify-center text-justify">
            <div className="max-w-3xl bg-white shadow-lg rounded-lg p-8 mt-9 mb-9">
                {/* About Us Section */}
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    About Us
                </h1>
                <p className="text-gray-600 leading-relaxed mb-6">
                    Welcome to EasyRTI, your trusted platform for filing and managing
                    Right to Information (RTI) applications seamlessly. Our mission is to
                    empower citizens by providing a user-friendly interface to access
                    public information and promote transparency in governance. We believe
                    in the power of information and its role in fostering accountability
                    and informed decision-making.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                    At EasyRTI, we simplify the process of drafting, submitting, and
                    tracking RTI applications. Whether you're seeking information from
                    government departments or public authorities, our platform ensures
                    that your requests are handled efficiently and effectively. Join us in
                    our journey to make information accessible to everyone.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                    Together, let's build a more transparent and informed society. Thank
                    you for choosing EasyRTI as your partner in accessing public
                    information.
                </p>

                {/* FAQ Section */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg"
                        >
                            <button
                                className="w-full flex justify-between items-center p-4 text-left text-gray-800 font-medium focus:outline-none"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span>{faq.question}</span>
                                <svg
                                    className={`w-5 h-5 transform ${
                                        activeIndex === index ? "rotate-180" : ""
                                    } transition-transform`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                            {activeIndex === index && (
                                <div className="p-4 text-gray-600 bg-gray-50">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <Footer/>
        </>
    );
};

export default FAQ;