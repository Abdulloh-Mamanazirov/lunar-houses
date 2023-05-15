import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Componenets/Navbar";

const Home = () => {
  let navigate = useNavigate();
  let [companyList, setCompanyList] = useState();
  let [complexList, setComplexList] = useState();
  let [roomList, setRoomList] = useState();
  let [durationList, setDurationList] = useState();
  let [company, setCompany] = useState();
  let [complex, setComplex] = useState();
  let [room, setRoom] = useState();
  let [bank, setBank] = useState();
  let [duration, setDuration] = useState();
  let [narx, setNarx] = useState();

  useEffect(() => {
    let check = sessionStorage.getItem("lunar");
    if (!check) return navigate("/log-in-user");
    async function getData() {
      let { data } = await axios.get("/companies");
      setCompanyList(data.rows);
    }
    getData();
  }, []);

  async function handleCompany(id) {
    let complexes = await axios.get(`/complexes/${id}`);
    setComplexList(complexes.data);
  }
  async function handleComplex(id) {
    let rooms = await axios.get(`/rooms/${id}`);
    setRoomList(rooms.data);
  }
  async function handleMortage() {
    setDurationList([10,15,20])
  }
  async function handleBank() {
    let selectedRoom = roomList?.map?.((rom) => rom?.id === room && rom);
    let totalPrice = selectedRoom[0]?.price * selectedRoom[0]?.kv;
    let banks = await axios.post(`/banks`,{totalPrice})
    setNarx(totalPrice)
    setBank(banks.data);
  }

  return (
    <>
      <Navbar />
      <div className="py-5">
        <h2 className="text-center text-5xl font-bold mb-5 text-blue-600">
          Choose a house by filtering
        </h2>
        <div className="bg-slate-400 shadow-xl w-10/12 mx-auto mb-5 p-4 rounded-xl flex items-end justify-center gap-5 max-md:flex-wrap">
          <div className="flex flex-col gap-2 w-1/4">
            <label className="text-white" htmlFor="companySelect">
              Building company:
            </label>
            <select
              onChange={(e) => {
                setCompany(e.target.value);
                handleCompany(e.target.value);
              }}
              id="companySelect"
              className="rounded-lg p-1 outline-blue-400"
            >
              <option selected disabled value="">
                Select one
              </option>
              {companyList?.map?.((com) => {
                return (
                  <option key={com?.id} value={com?.id}>
                    {com?.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-col gap-2 w-1/4">
            <label className="text-white" htmlFor="complexSelect">
              Complex:
            </label>
            <select
              onChange={(e) => {
                setComplex(e.target.value);
                handleComplex(e.target.value);
              }}
              id="complexSelect"
              className="rounded-lg p-1 outline-blue-400"
            >
              <option selected disabled value="">
                Select one
              </option>
              {complexList?.map?.((com) => {
                return (
                  <option key={com?.id} value={com?.id}>
                    {com?.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-col gap-2 w-1/4">
            <label className="text-white" htmlFor="roomSelect">
              Number of rooms:
            </label>
            <select
              onChange={(e) => {setRoom(e.target.value); handleMortage()}}
              id="roomSelect"
              className="rounded-lg p-1 outline-blue-400"
            >
              <option selected disabled value="">
                Select one
              </option>
              {roomList?.map?.((room) => {
                return (
                  <option key={room?.id} value={room?.id}>
                    {room?.number_of_rooms} rooms
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-col gap-2 w-1/4">
            <label className="text-white" htmlFor="mortageSelect">
              Mortage duration:
            </label>
            <select
              onChange={(e) => {
                setDuration(e.target.value);
                handleBank();
              }}
              id="mortageSelect"
              className="rounded-lg p-1 outline-blue-400"
            >
              <option selected disabled value="">
                Select one
              </option>
              {durationList?.map?.(d=>{
                return <option key={d} value={d}>{d} years</option>
              })}
            </select>
          </div>
          <button type="reset" className="rounded-lg p-1 px-3 text-white border bg-blue-600 hover:bg-blue-500" onClick={()=>window.location.reload()}>Reset</button>
        </div>
        <div className="bg-slate-200 shadow-2xl w-10/12 mx-auto p-3 rounded-xl flex items-center justify-around">
          <div className="flex flex-col items-center gap-3">
            <h2>
              Building company:{" "}
              <span className="text-lg font-medium">{companyList?.map?.((com) => com?.id === company && com?.name)}</span>
            </h2>
            <h2>
              Complex:{" "}
              <span className="text-lg font-medium">{complexList?.map?.((com) => com?.id === complex && com?.name)}</span>
            </h2>
            <h2>
              Address:{" "}
              <span className="text-lg font-medium">{complexList?.map?.((com) => com?.id === complex && com?.address)}</span>
            </h2>
            <h2>
              Number of rooms:{" "}
              <span className="text-lg font-medium">{roomList?.map?.(
                (rom) => rom?.id === room && rom?.number_of_rooms
              )}</span>
            </h2>
            <h2>
              Area: <span className="text-lg font-medium">{roomList?.map?.((rom) => rom?.id === room && rom?.kv)} m
              <sup>2</sup></span>
            </h2>
            <h2>
              Price per m<sup>2</sup>:{" "}
              <span className="text-lg font-medium">{roomList?.map?.((rom) => rom?.id === room && rom?.price)} sums</span>
            </h2>
          </div>
          {bank && <div className="flex flex-col items-center gap-3">
            <img width={200} src={bank?.image} alt="bank" />
            <span>Bank name: <span className="text-lg font-medium">{bank?.name}</span></span>
            <span>Maximum amount of loan: <span className="text-lg font-medium">{bank?.max_loan}</span></span>
            <span>Starting payment: <span className="text-lg font-medium">{bank?.starting_payment}%</span></span>
            <span>Loan duration: <span className="text-lg font-medium">{duration} years</span></span>
          </div>}
          {bank && <div className="flex flex-col items-center gap-3">
            <h2 className="text-2xl font-semibold">Calculator :</h2>
            <span>House price: <span className="text-lg font-medium">{narx} sums</span></span>
            <span>Starting payment: <span className="text-lg font-medium">{(narx / 100) * bank?.starting_payment} sums</span></span>
            <span>Monthly payment: <span className="text-lg font-medium">{(narx - ((narx / 100) * bank?.starting_payment)) / (duration * 12)} sums</span></span>
            <span>Payment duration: <span className="text-lg font-medium">{duration} years</span></span>
          </div>}
        </div>
      </div>
    </>
  );
};

export default Home;
