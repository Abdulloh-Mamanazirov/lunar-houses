import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  let location = useLocation();
  let navigate = useNavigate();

  function hadnleLogOut(){
    localStorage.removeItem("admin-token")
    sessionStorage.removeItem("lunar")
    return navigate("/log-in-user")
  };
  
  return (
    <div className="z-50 sticky top-0 py-1 bg-slate-200 flex items-center justify-between px-3 md:justify-around">
      <Link to="/" className="flex items-center gap-3 text-4xl">
        <img
          className="w-16 rounded-full"
          src="https://media.istockphoto.com/id/1152129571/vector/building-logo-design-in-modern-graphic-style.jpg?s=612x612&w=0&k=20&c=dZ1cdCkKtDFVT0QFABE2sqIJWhw2jj-4wAUTEOF50AY="
          alt="logo"
        />{" "}
        LUNAR
      </Link>
      <ul className="flex items-center gap-5">
        <li
          className={
            location.pathname === "/"
              ? "text-lg border-2 border-blue-500 bg-blue-500 text-white rounded-md"
              : "text-lg border-2 border-blue-500 rounded-md"
          }
        >
          <Link className=" px-5" to="/">
            Home
          </Link>
        </li>
        <li
          className={
            location.pathname === "/company" ||
            location.pathname === "/complex" ||
            location.pathname === "/room" ||
            location.pathname === "/users"
              ? "text-lg border-2 border-blue-500 bg-blue-500 text-white rounded-md"
              : "text-lg border-2 border-blue-500 rounded-md"
          }
        >
          <Link className=" px-5" to="/company">
            Admin
          </Link>
        </li>
      </ul>
      <span className="text-lg flex items-center gap-5">
        <a href="tel:+998949813606">+998 94 9813606</a>
        <span onClick={hadnleLogOut} className="flex items-center gap-2 cursor-pointer  text-blue-500 border border-blue-500 rounded-lg p-1 hover:bg-blue-500 hover:text-white">
          <span className="text-base font-semibold">Log out</span>
          <i className="fa-solid fa-right-from-bracket text-xl"></i>
        </span>
      </span>
    </div>
  );
};

export default Navbar;
