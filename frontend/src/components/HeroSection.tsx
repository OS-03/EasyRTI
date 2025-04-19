import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
// import { setSearchedQuery } from '../../redux/jobSlice';
import { useNavigate } from "react-router-dom";
import Typewriter from "typewriter-effect";

const CounterCard = ({ start, end, duration, label, color }:any) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [start, end, duration]);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg transition-all duration-500 ease-in-out transform hover:scale-110">
      <h2 className={`text-3xl font-bold ${color}`}>{count.toLocaleString()}&nbsp;+</h2>
      <p className="text-gray-600 mt-2">{label}</p>
    </div>
  );
};

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchRequestHandler = () => {
    // dispatch(setSearchedQuery(query));
    // navigate("/browse");
  };

  return (
    <div className="text-center">
      <div className="flex flex-col gap-5 my-10">
        <div className="relative group cursor-pointer hover:visible my-1 w-80 mx-auto text-center">
          <div className="invisible absolute -inset-1 bg-gradient-to-br from-orange-400 to-emerald-300 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:visible duration-1000 ease-in-out"></div>
          <span className="relative w-auto px-6 py-5 bg-white text-black ring-1 ring-gray-900/5 rounded-full leading-none flex items-center justify-center space-x-6 text-sm font-semibold bg-clip-text text-black font-script drop-shadow-sm hover:text-neutral-100 dark:text-sky-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h18M9 21V10m6 11V10M5 6h14M7 3h10"
              />
            </svg>
            Official Government Portal
          </span>
        </div>
        <h1 className="text-5xl font-bold">
          Request Your
          <br />
          New{" "}
          <span className="text-5xl font-semibold bg-gradient-to-br from-orange-500 via-orange-100 via-neutral-100 to-emerald-500 bg-clip-text text-transparent font-script drop-shadow-sm">
            RTI
          </span>
        </h1>
        <div className="text-2xl flex justify-center flex-col">
          On Departments
          <span className="flex justify-center font-semibold bg-gradient-to-br from-orange-500 via-orange-100 via-neutral-100 to-emerald-600 bg-clip-text text-transparent font-script drop-shadow-sm">
            @&nbsp;
            <Typewriter
              options={{
                strings: [
                  "Finance",
                  "Health",
                  "Election Commission",
                  "Transport",
                  "Environment",
                  "Education",
                  "Housing",
                  "Agriculture",
                ],
                autoStart: true,
                loop: true,
                deleteSpeed: 30,
              }}
            />
          </span>
        </div>
        <div className="flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
          <input
            type="text"
            placeholder="Search Your RTI Requests..."
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none border-none w-full"
          />
          <Button
            onClick={searchRequestHandler}
            className="rounded-r-full bg-[#1caa76]"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
        <div className="w-1/1 grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 text-center ml-5 mr-5 justify-center">
          <CounterCard
            start={0}
            end={12345}
            duration={930}
            label="Total Applicants Registered"
             color="text-blue-500"
            style={{ height: "150px" }}
          />
          <CounterCard
            start={0}
            end={8765}
            duration={930}
            label="Total RTIs Filed"
            color="text-orange-500"
            style={{ height: "150px" }}
          />
          <CounterCard
            start={0}
            end={7890}
            duration={930}
            label="Total RTI Requests Accepted"
               color="text-emerald-500"
        
            style={{ height: "150px" }}
          />
        </div>
        <div className="px-4 sm:px-20 md:px-30 lg:px-60 xl:px-60 font-extralight">
          <p className="text-justify">
            This RTI Online Portal is a comprehensive platform designed to
            address the challenges by enabling citizens to submit RTI requests
            and appeals electronically. It allows users to track application
            status using unique registration numbers, make payments through
            multiple options such as net banking and cards, and upload necessary
            documents. Special provisions for Below Poverty Line (BPL)
            applicants, including fee waivers and simplified document
            requirements, ensure inclusivity and accessibility. By combining
            advanced technologies with user-centric design, this project aims to
            revolutionize the RTI process and set a benchmark for e-governance
            systems.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
