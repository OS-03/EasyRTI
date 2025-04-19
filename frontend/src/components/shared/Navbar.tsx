import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom";
import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import Emblem from "/src/assets/Emblem.png";
import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
import { toast } from "sonner";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children?: React.ReactElement<unknown>;
}
function ScrollTop(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 30, right: 17 }}
      >
        {children}
      </Box>
    </Fade>
  );
}

const Navbar = (props: Props) => {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const { user } = useTypedSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-10 backdrop-filter backdrop-blur-md bg-white bg-opacity-40 shadow-md rounded-2xl border border-gray-200 h-24">
        <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 rounded-5xl h-24">
          <a href="/">
            <div className="flex gap-5">
              <img src={Emblem} alt="Emblem" className="h-13 w-9" />
              <span className="dark:hover:bg-slate-100  focus-visible:ring-slate-500/50 relative before:absolute before:inset-0  before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.5)_50%,transparent_75%,transparent_100%)] dark:before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms] text-5xl font-semibold  bg-gradient-to-br from-orange-500 via-orange-100 via-neutral-100 to-emerald-500  bg-clip-text text-transparent font-script drop-shadow-sm">
                EasyRTI
              </span>
            </div>
          </a>
          <div className="flex items-center gap-4 h-24">
            <button
              className="lg:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              onClick={() => {
                const menu = document.getElementById("mobile-menu");
                if (menu) menu.classList.toggle("hidden");
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
            <div className="lg:flex ">
              <ul
                id="mobile-menu"
                className="hidden lg:flex flex-col lg:flex-row font-medium gap-7 bg-white lg:bg-transparent absolute lg:static top-24 right-0 lg:right-auto w-full lg:w-auto z-20 lg:z-auto shadow-md lg:shadow-none justify-end text-right p-5 lg:p-0 transition-all duration-100 ease-[cubic-bezier(0.95,0.05,0.795,0.035)] lg:transition-none lg:duration-0 lg:ease-linear"
              >
                {user && user.role === "government" ? (
                  <>
                    <li className="block lg:inline-block transform transition-transform duration-200 hover:-translate-x-2 mt-2 mb-2">
                      <Link to="/admin/dashboard">Dashboard</Link>
                    </li>
                    <li className="block lg:inline-block transform transition-transform duration-200 hover:-translate-x-2 mt-2 mb-2">
                      <Link to="/admin/department">Departments</Link>
                    </li>
                    <li className="block lg:inline-block transform transition-transform duration-200 hover:-translate-x-2 mt-2 mb-2">
                      <Link to="/admin/applicants">Applicants</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="block lg:inline-block transform transition-transform duration-200 hover:-translate-x-2 mt-2 mb-2">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="block lg:inline-block transform transition-transform duration-200 hover:-translate-x-2 mt-2 mb-2">
                      <Link to="/rules">Request</Link>
                    </li>
                    <li className="block lg:inline-block transform transition-transform duration-200 hover:-translate-x-2 mt-2 mb-2">
                      <a href="https://rtionline.maharashtra.gov.in/UMcitizen_Eng.pdf" target="_blank" rel="noopener noreferrer">UserManual</a>
                    </li>
                    <li className="block lg:inline-block transform transition-transform duration-200 hover:-translate-x-2 mt-2 mb-2">
                      <Link to="/contact">ContactUs</Link>
                    </li>
                    <li className="block lg:inline-block transform transition-transform duration-200 hover:-translate-x-2 mt-2 mb-2">
                      <Link to="/faq">FAQ</Link>
                    </li>
                    <li className="block lg:inline-block transform transition-transform duration-200 hover:-translate-x-2 mt-2 mb-2">
                      <Link to="/viewstatus">ViewStatus</Link>
                    </li>
                    {!user && (
                      <>
                        <li className="block lg:hidden transform transition-transform duration-200 hover:-translate-x-2 mt-2 mb-2">
                          <Link to="/signin">Login</Link>
                        </li>
                        <li className="block lg:hidden transform transition-transform duration-200 hover:-translate-x-2 mt-2 mb-2">
                          <Link to="/signup">Signup</Link>
                        </li>
                      </>
                    )}
                  </>
                )}
              </ul>
            </div>
            {!user ? (
              <div className="hidden lg:flex items-center gap-2 ">
                <Link to="/signin">
                  <Button
                    variant="outline"
                    className="tbtn w-full my-4 bg-gradient-to-tr from-orange-100  text-black hover:bg-gradient-to-tr hover:from-emerald-100 hover:text-blue-400 dark:text-sky-400 m-0"
                  >
                    Signin
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-tr from-orange-500  hover:from-emerald-500 hover:text-blue-400 dark:text-sky-400 m-0">
                    Signup
                  </Button>
                </Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt="@shadcn"
                    />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-white">
                  <div className="bg-white">
                    <div className="flex gap-2 space-y-2">
                      <Avatar className="cursor-pointer">
                        <AvatarImage
                          src={user?.profile?.profilePhoto}
                          alt="@shadcn"
                        />
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{user?.fullname}</h4>
                        <p className="text-sm text-muted-foreground">
                          {user?.profile?.bio}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col my-2 text-gray-600">
                      {user && user.role === "citizen" && (
                        <div className="flex w-fit items-center gap-2 cursor-pointer bg-white">
                          <User2 />
                          <Button variant="link">
                            <Link to="/profile">View Profile</Link>
                          </Button>
                        </div>
                      )}
                      <div className='flex w-fit items-center gap-2 cursor-pointer'>
                        <LogOut />
                        <Button onClick={logoutHandler} variant="link">Logout</Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </nav>
      <Toolbar id="back-to-top-anchor" />
      <div style={{ position: 'relative', zIndex: 1000 }}>
        <ScrollTop {...props}>
          <Fade in={useScrollTrigger({ threshold: 100 })}>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
          </Fade>
        </ScrollTop>
      </div>
      {/* </React.Fragment> */}
    </>
  );
};

export default Navbar;
