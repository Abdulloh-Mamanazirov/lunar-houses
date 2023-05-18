import React, { useRef } from "react";
import axios from "axios";
import {toast} from "react-toastify";
import CurrencyFormat from "react-currency-format";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Componenets/Navbar";

const Home = () => {
  let navigate = useNavigate();
  let selectDuration = useRef();
  let savedModal = useRef();
  let [user, setUser] = useState();
  let [userHouses, setUserHouses] = useState();
  let [companyList, setCompanyList] = useState();
  let [complexList, setComplexList] = useState();
  let [roomList, setRoomList] = useState();
  let [durationList, setDurationList] = useState();
  let [company, setCompany] = useState();
  let [complex, setComplex] = useState();
  let [room, setRoom] = useState();
  let [bank, setBank] = useState();
  let [duration, setDuration] = useState();
  let [calculation, setCalculation] = useState();

  useEffect(() => {
    let check = sessionStorage.getItem("lunar") || localStorage.getItem("admin-token");
    if (!check) return navigate("/log-in-user");
    setUser(JSON.parse(sessionStorage.getItem("lunar")))
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
    setDurationList([5,10,15,20])
  }
  async function handleBank(e) {
    let selectedRoom;
    await roomList?.map?.((rom) => {
      if(rom?.id === room) selectedRoom = rom
    });
    let totalPrice = selectedRoom?.price * selectedRoom?.kv;
    let banks = await axios.post(`/banks`,{totalPrice})
    let calculations = await axios.post(`/calculation`,{roomP:selectedRoom?.price, roomKv:selectedRoom?.kv, sp:banks?.data?.starting_payment, d:selectDuration.current.value})
    if(calculations.status === 200){
      setCalculation(calculations.data.data[0].calculator)
      toast(calculations.data.msg, {type:"success"})
    }
    setBank(banks.data);
  }

  async function handleSaveHouse(){
    let res = await axios
      .post("/save-calculation", {
        user_id: user?.[0]?.id,
        total: calculation?.[0],
        starting: calculation?.[1],
        monthly: calculation?.[2],
      }).then(res=> {return res})
      .catch((error) => {
        return toast(error?.response?.data, { type: "warning" });
      });
    if(res?.status === 200){
      let saving = await axios.post(`/save-house`,{
        company_id:company,
        complex_id:complex,
        room_id:room,
        bank_id:bank?.id,
        duration:duration,
        user_id:user?.[0]?.id,
      })
      return toast(saving?.data, {type:"success"})
    }
  } 

  async function getHouses(){
    let houses = await axios.get(`/get-houses/${user?.[0]?.id}`);
    setUserHouses(houses?.data?.houses);
  }

  async function handleDelete(id){
    axios.delete(`/delete-houses/${id}`).catch(error => {console.log(error);}).then(res=>toast("Deleted", {type:"info"}))
  }

  return (
    <>
      <Navbar />
      <div className="py-5 relative">
        {user?.[0] && <div className="bg-slate-200 absolute top-0 right-0 flex items-center gap-5 p-3 rounded-bl-xl">
          <button onClick={()=>{getHouses(); savedModal.current.showModal()}} className="bg-blue-600 text-white p-3 px-4 rounded-lg hover:bg-blue-500 active:bg-blue-400" title="Show saved houses"><i className="fa-solid fa-bookmark"></i></button>
          <div className="flex flex-col gap-1">
            <span className="text-xl">Name: <span className="font-semibold">{user?.[0]?.name}</span></span>
            <span className="text-lg">Email: <span className="font-semibold">{user?.[0]?.email}</span></span>
          </div> 
        </div>}
        <h2 className="text-center text-5xl font-bold my-5 text-blue-600">
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
                handleBank(e);
              }}
              ref={selectDuration}
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
        <div className="relative bg-slate-200 shadow-2xl w-10/12 mx-auto p-3 rounded-xl flex items-center justify-around">
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
              Number of room(s):{" "}
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
              <span className="text-lg font-medium">{roomList?.map?.((rom) => rom?.id === room && <CurrencyFormat key={crypto.randomUUID()} value={rom?.price} displayType={'text'} thousandSeparator={true}/>)} sums</span>
            </h2>
          </div>
          {bank && <div className="flex flex-col items-center gap-3">
            <img width={200} src={bank?.image} alt="bank" />
            <span>Bank name: <span className="text-lg font-medium">{bank?.name}</span></span>
            <span>Maximum amount of loan: <span className="text-lg font-medium"><CurrencyFormat value={bank?.max_loan} displayType={'text'} thousandSeparator={true}/>  sums</span></span>
            <span>Starting payment: <span className="text-lg font-medium">{bank?.starting_payment}%</span></span>
            <span>Loan duration: <span className="text-lg font-medium">{duration} years</span></span>
          </div>}
          {bank && <div className="flex flex-col items-center gap-3">
            <h2 className="text-2xl font-semibold">Calculator :</h2>
            <span>House price: <span className="text-lg font-medium"><CurrencyFormat value={calculation?.[0]} displayType={'text'} thousandSeparator={true}/>  sums</span></span>
            <span>Starting payment: <span className="text-lg font-medium"><CurrencyFormat value={calculation?.[1]} displayType={'text'} thousandSeparator={true}/>  sums</span></span>
            <span>Monthly payment: <span className="text-lg font-medium"><CurrencyFormat value={calculation?.[2]} displayType={'text'} thousandSeparator={true}/>  sums</span></span>
            <span>Payment duration: <span className="text-lg font-medium">{duration} years</span></span>
          </div>}
          {bank && <button onClick={handleSaveHouse} className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-lg hover:bg-green-500 active:bg-green-400">Save house</button>}
        </div>
        <dialog
          ref={savedModal}
          className="backdrop:bg-black backdrop:bg-opacity-50 rounded-xl relative "
        >
        <i
          className="fa-regular fa-xmark absolute top-0 right-0 bg-red-500 font-bold text-white py-2 px-5"
          onClick={() => savedModal.current.close()}
        ></i>
        <div>
          <h2 className="text-center text-3xl font-semibold pb-2">My saved houses</h2>
          <table>
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 border-2 border-white">#</th>
                <th className="border-2 border-white">Company Name</th>
                <th className="border-2 border-white">Complex</th>
                <th className="border-2 border-white">Number of room(s)</th>
                <th className="border-2 border-white">Price per m<sup>2</sup></th>
                <th className="border-2 border-white">Area</th>
                <th className="border-2 border-white">Action</th>
              </tr>
            </thead>
            <tbody className="text-center bg-gray-100">
              {userHouses?.map?.((house,ind)=>{
                return (
                  <tr key={crypto.randomUUID()}>
                    <td className="border-2 px-2">{ind+1}</td>
                    <td className="border-2 px-2">{house?.company_name}</td>
                    <td className="border-2 px-2">{house?.complex_name} ({house?.complex_address})</td>
                    <td className="border-2 px-2">{house?.number_of_rooms}</td>
                    <td className="border-2 px-2">{house?.price}</td>
                    <td className="border-2 px-2">{house?.kv} m<sup>2</sup></td>
                    <td>
                    <i onClick={()=>handleDelete(house?.id)} className="fa-solid fa-trash my-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-500 active:bg-red-400"></i>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </dialog>
      </div>
    </>
  );
};

export default Home;
