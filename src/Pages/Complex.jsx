import axios from "axios";
import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../Componenets/Navbar";
import Sidebar from "../Componenets/Sidebar";

const Complex = () => {
  let navigate = useNavigate();
  let dialog = useRef();
  let [refresh, setRefresh] = useState(true);
  let [complex, setComplex] = useState(null);
  let [address, setAddress] = useState(null);
  let [company, setCompany] = useState(null);
  let [complexList, setComplexList] = useState();
  let [companyList, setCompanyList] = useState();
  let [complexData, setComplexData] = useState();

  useEffect(() => {
    if (!localStorage.getItem("admin-token")) return navigate("/log-in-admin");
    async function getComplexes() {
      try {
        let { data } = await axios.get("/complexes");
        setComplexList(data);
      } catch (error) {
        console.log(error);
      }
    }
    async function getCompanies() {
      try {
        let { data } = await axios.get("/companies");
        setCompanyList(data?.rows);
      } catch (error) {
        console.log(error);
      }
    }
    getComplexes()
    getCompanies();
  }, [refresh]);

  async function handleSubmit(e) {
    e.preventDefault();

    let res = await axios.post("/add-complex", {name:complex, address, company}, {headers:{token:localStorage.getItem("admin-token")}})
    .catch((error)=>{
      if(error?.response?.status !== 200){
        toast(error?.response?.data?.details?.[0]?.message || error?.response?.data, {type:"error"})
      }
    })

    if(res?.status === 200){
      setRefresh(!refresh)
      toast(res?.data, {type:"success"});
      e.target.reset()
      return;
    }
  }

  async function handleDelete(id) {
    let confirmation = confirm("Are you sure to delete this complex?");
    if (confirmation) {
      let res = await axios.delete(`/delete-complex/${id}`, {
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
    let response = await axios.put(`/update-complex/${complexData?.complex_id}`, {name:complex, address, company}, {headers:{token:localStorage.getItem("admin-token")}})
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
            <h2 className="text-center text-5xl font-semibold pb-3">Add complex</h2>
          <form
            onSubmit={handleSubmit}
            className="bg-slate-400 shadow-xl mx-auto mb-5 p-4 rounded-xl grid grid-cols-4 items-end gap-5"
          >
            <div className="flex flex-col gap-2">
              <label className="text-white" htmlFor="complexInput">
                Complex name:
              </label>
              <input
                onChange={(e) => setComplex(e.target.value)}
                id="complexInput"
                className="rounded-lg p-1 outline-blue-400 shadow-lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white" htmlFor="AddressInput">
                Address name:
              </label>
              <input
                onChange={(e) => setAddress(e.target.value)}
                id="AddressInput"
                className="rounded-lg p-1 outline-blue-400 shadow-lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white" htmlFor="AddressInput">
                Select a company:
              </label>
              <select onChange={(e)=>setCompany(e.target.value)} id="companySelect" className="rounded-lg p-1 outline-blue-400">
                  <option selected disabled value="4">Select one</option>
                  {
                    companyList?.map?.(company=>{
                      return <option key={company?.id} value={company?.name}>{company?.name}</option>
                    })
                  }
              </select>
            </div>
            <button
              type="submit"
              className="p-1 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500"
            >
              Submit
            </button>
            
          </form>

          <table className="bg-slate-200 w-full text-center rounded-lg">
            <thead className="bg-slate-400 text-lg">
              <tr>
                <th>#</th>
                <th>Complex name</th>
                <th>Address</th>
                <th>Company name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                complexList?.map?.((complex, ind)=>{
                    return <tr key={complex?.complex_id} className="border-t border-white">
                      <td>{ind+1}</td>
                      <td>{complex?.complex_name}</td>
                      <td>{complex?.address}</td>
                      <td>{complex?.company_name}</td>
                      <td>
                        <i onClick={()=>handleDelete(complex?.complex_id)} className="fa-solid fa-trash my-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-500 active:bg-red-400"></i>
                        <i
                        onClick={() => {setComplexData(complex); dialog.current.showModal()}}
                        className="fa-solid fa-edit my-1 ml-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-500 active:bg-blue-400"
                      ></i>
                      </td>
                    </tr>
                })
              }
            </tbody>
          </table>
        </div>
      </div>
      <dialog ref={dialog} className="backdrop:bg-black backdrop:bg-opacity-40 border rounded-xl">
        <form onSubmit={handleUpdate} className="flex flex-col gap-3">
          <h2 className="text-center text-2xl font-semibold">Edit Complex</h2>
              <input
                defaultValue={complexData?.complex_name}
                onChange={(e) => setComplex(e.target.value)}
                className="border border-blue-500 w-72 rounded-lg p-1 outline-blue-400 shadow-lg"
              />
              <input
                defaultValue={complexData?.address}
                onChange={(e) => setAddress(e.target.value)}
                className="border border-blue-500 w-72 rounded-lg p-1 outline-blue-400 shadow-lg"
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

export default Complex;
