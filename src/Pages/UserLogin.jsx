import axios from "axios";
import React, { useState } from "react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserLogin = () => {
  let navigate = useNavigate();
  let name = useRef();
  let email = useRef();
  let [ loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true)
    
    let res = await axios
      .post("/log-in-user", {
        name: name.current.value,
        email: email.current.value,
      }).then(res=>{setLoading(false); return res})
      .catch(function (error) {
        if (error)
          setLoading(false)
          return toast(error?.response?.data?.details[0]?.message, {
            type: "error",
          });
      });
      
    if (res.status === 200) {
      toast(res?.data?.msg, { type: "success" });
      sessionStorage.setItem("lunar", JSON.stringify(res?.data?.user));
      return navigate("/");
    }
  }

  return (
    <>
      <div className="background absolute inset-0 grid place-items-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 border rounded-xl p-3 bg-slate-400 bg-opacity-60 backdrop-blur-md md:w-1/4"
        >
          <h2 className="text-5xl pb-2 text-center font-bold">Log In</h2>
          <input
            required
            ref={name}
            className="border-2 rounded-lg border-blue-400 outline-blue-400 p-1"
            placeholder="Enter name"
            type="text"
          />
          <input
            required
            ref={email}
            className="border-2 rounded-lg border-blue-400 outline-blue-400 p-1"
            placeholder="Enter email"
            type="text"
          />
          <button
            disabled={loading}
              type="submit"
              className="p-1 w-full bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500"
            >
              {!loading ? "Submit" : <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
            </button>
          <span className="text-center text-white">
            If you are an admin,{" "}
            <Link className="text-sky-100 underline" to="/log-in-admin">
              log in here!
            </Link>
          </span>
        </form>
      </div>
    </>
  );
};

export default UserLogin;
