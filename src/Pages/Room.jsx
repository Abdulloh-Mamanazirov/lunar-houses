import axios from "axios";
import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import CurrencyFormat from "react-currency-format";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../Componenets/Navbar";
import Sidebar from "../Componenets/Sidebar";

const Room = () => {
  let navigate = useNavigate();
  let dialog = useRef();
  let [loading, setLoading] = useState(false);
  let [refresh, setRefresh] = useState()
  let [roomList, setRoomList] = useState()
  let [complexList, setComplexList] = useState()
  let [room, setRoom] = useState(null);
  let [price, setPrice] = useState(null);
  let [kv, setKv] = useState(null);
  let [complex, setComplex] = useState(null);
  let [roomData, setRoomData] = useState();

  useEffect(() => {
    if (!localStorage.getItem("admin-token")) return navigate("/log-in-admin");
    async function getData(){
      let rooms = await axios.get('/rooms').catch(error => {if(error) console.log(error)})
      let complex = await axios.get('/complexes').catch(error => {if(error) console.log(error)})
      setRoomList(rooms.data);
      setComplexList(complex.data);
    }
    getData()
  }, [refresh]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true)
    let res = await axios.post("/add-room", {number_of_rooms:room, price, kv, complex}, {headers:{token:localStorage.getItem("admin-token")}}).then((res) => {setLoading(false); return res})
    .catch((error)=>{
      if(error?.response?.status !== 200){
        toast(error?.response?.data?.details?.[0]?.message || error?.response?.data, {type:"error"})
        setLoading(false);
      }
    })

    if(res?.status === 200){
      setRefresh(!refresh)
      toast(res?.data, {type:"success"});
      e.target.reset()
      return;
    }
  }

  async function handleDelete(id){
    let confirmation = confirm("Are you sure to delete this room?");
    if (confirmation) {
      let res = await axios.delete(`/delete-room/${id}`, {
        headers: { token: localStorage.getItem("admin-token") },
      }).catch((error)=>{
      if(error?.response?.status !== 200){
        toast(error?.response?.data, {type:"error"})
      }
    });
      if (res?.status === 200) {
        toast(res?.data, { type: "info" });
        setRefresh(!refresh);
      }
    }
  }

  async function handleUpdate(e){
    e.preventDefault()
    let response = await axios.put(`/update-room/${roomData?.room_id}`, {number_of_rooms:room, price, kv}, {headers:{token:localStorage.getItem("admin-token")}})
      .catch(function (error) {
        if (error) return toast(error?.response?.data?.details?.[0]?.message || error?.response?.data, {type: "error",});
      });

      if(response.status === 200){
        toast(response.data, {type:"success"})
        setRefresh(!refresh)
        e.target.reset()
        return dialog.current.close()
      }
  }

  return (
    <>
      <Navbar />
      <div>
        <Sidebar />
        <div className="pl-72 py-5 pr-8">
            <h2 className="text-center text-5xl font-semibold pb-3">Add room</h2>
          <form
            onSubmit={handleSubmit}
            className="bg-slate-400 shadow-xl mx-auto mb-5 p-4 rounded-xl grid grid-cols-5 items-end gap-5"
          >
            <div className="flex flex-col gap-2">
              <label className="text-white" htmlFor="numberInput">
                Rooms:
              </label>
              <input
                onChange={(e) => setRoom(e.target.value)}
                type="number"
                id="numberInput"
                className="rounded-lg p-1 outline-blue-400 shadow-lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white" htmlFor="priceInput">
                Per m<sup>2</sup> price:
              </label>
              <input
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                id="priceInput"
                className="rounded-lg p-1 outline-blue-400 shadow-lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white" htmlFor="KvInput">
                m<sup>2</sup> (KV):
              </label>
              <input
                onChange={(e) => setKv(e.target.value)}
                type="number"
                id="PriceInput"
                className="rounded-lg p-1 outline-blue-400 shadow-lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white" htmlFor="complexInput">
                Select a complex:
              </label>
              <select
                onChange={(e) => setComplex(e.target.value)}
                id="complexInput"
                className="rounded-lg p-1 outline-blue-400"
              >
                <option selected disabled value="4">
                  Select one
                </option>
                {
                  complexList?.map?.(complex=>{
                    return <option key={complex?.complex_id} value={complex?.complex_name}>{complex?.complex_name}</option>
                  })
                }
              </select>
            </div>
            <button
            disabled={loading}
              type="submit"
              className="p-1 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500"
            >
              {!loading ? "Submit" : <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
            </button>
          </form>

          <table className="table-auto bg-slate-200 w-full text-center rounded-lg">
            <thead className="bg-slate-400 text-lg">
              <tr>
                <th>#</th>
                <th>Number of room(s)</th>
                <th>Per m<sup>2</sup> price</th>
                <th>m<sup>2</sup></th>
                <th>Complex</th>
                <th>Company</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
               roomList?.length > 0 ?  roomList?.map?.((room,ind) => {
                  return (
                    <tr key={room?.room_id} className="border-t border-white">
                      <td>{ind+1}</td>
                      <td>{room?.number_of_rooms} {room?.number_of_rooms > 1 ? "rooms" : "room"}</td>
                      <td><CurrencyFormat value={room?.price} displayType={'text'} thousandSeparator={true}/> sums</td>
                      <td>
                        {room?.kv} m<sup>2</sup>
                      </td>
                      <td>{room?.comlex_name}</td>
                      <td>{room?.company_name}</td>
                      <td>
                        <i onClick={()=>handleDelete(room?.room_id)} className="fa-solid fa-trash cursor-pointer my-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-500 active:bg-red-400"></i>
                        <i onClick={() => {setRoomData(room); dialog.current.showModal()}}
                        className="fa-solid fa-edit cursor-pointer my-1 ml-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-500 active:bg-blue-400"
                      ></i>
                      </td>
                    </tr>
                  );
                }) : new Array(5).fill(1).map(a=>{
                return <tr key={crypto.randomUUID()} className="border-y-4 ">
                <td className="border-x-4 bg-gray-400 bg-opacity-70 w-3 p-1 animate-pulse"><span></span></td>
                <td className="border-x-4 bg-gray-400 bg-opacity-70 w-16 p-1 animate-pulse"><span></span></td>
                <td className="border-x-4 bg-gray-400 bg-opacity-70 w-16 p-1 animate-pulse"><span></span></td>
                <td className="border-x-4 bg-gray-400 bg-opacity-70 w-16 p-1 animate-pulse"><span></span></td>
                <td className="border-x-4 bg-gray-400 bg-opacity-70 w-16 p-1 animate-pulse"><span></span></td>
                <td className="border-x-4 bg-gray-400 bg-opacity-70 w-10 p-1 animate-pulse"><span></span></td>
                <td className="border-x-4 bg-gray-400 bg-opacity-70 w-5 p-1 animate-pulse"><span> </span></td>
              </tr>
              })
              }
            </tbody>
          </table>
        </div>
      </div>
      <dialog ref={dialog} className="backdrop:bg-black backdrop:bg-opacity-40 border rounded-xl">
        <form onSubmit={handleUpdate} className="flex flex-col gap-3">
          <h2 className="text-center text-2xl font-semibold">Edit Room</h2>
              <input
                placeholder="Number of rooms"
                defaultValue={roomData?.number_of_rooms}
                onChange={(e) => setRoom(e.target.value)}
                type="number"
                className="rounded-lg w-72 p-1 outline-blue-400 shadow-lg"
              />
              <input
                placeholder="Price per m2"
                defaultValue={roomData?.price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                className="rounded-lg p-1 outline-blue-400 shadow-lg"
              />
              <input
                placeholder="Area (m2)"
                defaultValue={roomData?.kv}
                onChange={(e) => setKv(e.target.value)}
                type="number"
                className="rounded-lg p-1 outline-blue-400 shadow-lg"
              />
          <div>
            <button className="border bg-red-500 text-white rounded-md px-3 py-1" formMethod="dialog" type="reset" onClick={()=>dialog.current.close()}>
              Cancel
            </button>
            <button className="border bg-blue-600 text-white rounded-md px-3 py-1 ml-2" type="submit">Submit</button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default Room;
