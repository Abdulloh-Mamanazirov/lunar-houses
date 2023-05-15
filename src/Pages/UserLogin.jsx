import axios from "axios";
import React from "react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserLogin = () => {
  let navigate = useNavigate();
  let name = useRef();
  let email = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    let res = await axios
      .post("/log-in-user", {
        name: name.current.value,
        email: email.current.value,
      })
      .catch(function (error) {
        if (error)
          return toast(error?.response?.data?.details[0]?.message, {
            type: "error",
          });
      });
    if (res.status === 200) {
      toast(res?.data?.msg, { type: "success" });
      sessionStorage.setItem("lunar", Math.random())
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
            className="p-2 w-full bg-blue-600 rounded-lg shadow-lg text-white active:bg-blue-400 hover:bg-blue-500"
            type="submit"
          >
            Submit
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
