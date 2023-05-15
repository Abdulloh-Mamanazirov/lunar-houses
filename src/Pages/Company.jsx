import axios from "axios";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../Componenets/Navbar";
import Sidebar from "../Componenets/Sidebar";

const Company = () => {
  let navigate = useNavigate();
  let dialog = useRef()
  let [refresh, setRefresh] = useState(true);
  let [company, setCompany] = useState(null);
  let [image, setImage] = useState(null);
  let [companyList, setCompnayList] = useState();
  let [companyData, setCompnayData] = useState();

  useEffect(() => {
    if (!localStorage.getItem("admin-token")) return navigate("/log-in-admin");
    async function getCompanies() {
      try {
        let { data } = await axios.get("/companies");
        setCompnayList(data?.rows);
      } catch (error) {
        console.log(error);
      }
    }
    getCompanies();
  }, [refresh]);

  async function handleSubmit(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append("image", image);

    let res = await axios.post(
      "https://api.upload.io/v2/accounts/FW25bJs/uploads/form_data",
      formData,
      {
        headers: {
          Authorization: `Bearer public_FW25bJs8dq5vJKxsBH3L7jTMoQh7`,
        },
      }
    );
    if (res.status === 200) {

      let response = await axios.post("/add-company", {name:company, image:res?.data?.files?.[0]?.fileUrl}, {
        headers:{
          token:localStorage.getItem("admin-token")
        }
      }).catch(function (error) {
        if (error) return toast(error?.response?.data?.details?.[0]?.message || error?.response?.data, {type: "error",});
      });

      if(response.status === 200){
        toast(response.data, {type:"success"})
        setRefresh(!refresh)
        e.target.reset()
      }
    }
  }

  async function handleDelete(id){
    let confirmation = confirm("Are you sure to delete this company?")
    if(confirmation){
      let res = await axios.delete(`/delete-company/${id}`, {headers:{token:localStorage.getItem("admin-token")}}).catch((error)=>{
      if(error?.response?.status !== 200){
        toast(error?.response?.data?.details?.[0]?.message || error?.response?.data, {type:"error"})
      }
    })
      if(res.status === 200){
        toast(res?.data, {type:"info"})
        setRefresh(!refresh)
      }
    }
  }

  async function handleUpdate(e){
    e.preventDefault()
    let response = await axios.put(`/update-company/${companyData?.id}`, {name:company}, {headers:{token:localStorage.getItem("admin-token")}})
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
          <h2 className="text-center text-5xl font-semibold pb-3">
            Add company
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-slate-400 shadow-xl mx-auto mb-5 p-4 rounded-xl grid grid-cols-3 items-end gap-5"
          >
            <div className="flex flex-col gap-2">
              <label className="text-white" htmlFor="companySelect">
                Building company name:
              </label>
              <input
                onChange={(e) => setCompany(e.target.value)}
                id="companySelect"
                className="rounded-lg p-1 outline-blue-400 shadow-lg"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white" htmlFor="file">
                Set an image:
              </label>
              <input
                className="file:border-none rounded-lg file:py-1 file:px-3 file:bg-gray-200 bg-white shadow-lg"
                id="file"
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
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
                <th>Name</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {companyList?.map?.((company, ind) => {
                return (
                  <tr key={company?.id} className="border-t border-white">
                    <td>{ind + 1}</td>
                    <td>{company?.name}</td>
                    <td>
                      <img
                        className="mx-auto"
                        src={company?.image}
                        width={70}
                        alt="image"
                      />
                    </td>
                    <td>
                      <i
                        onClick={() => handleDelete(company?.id)}
                        className="fa-solid fa-trash my-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-500 active:bg-red-400"
                      ></i>
                      <i
                        onClick={() => {setCompnayData(company); dialog.current.showModal()}}
                        className="fa-solid fa-edit my-1 ml-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-500 active:bg-blue-400"
                      ></i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <dialog ref={dialog} className="backdrop:bg-black backdrop:bg-opacity-40 border rounded-xl">
        <form onSubmit={handleUpdate} className="flex flex-col gap-3">
          <h2 className="text-center text-2xl font-semibold">Edit Company</h2>
          <input defaultValue={companyData?.name}
            onChange={(e) => setCompany(e.target.value)}
            className="w-72 rounded-lg border border-blue-400 p-1 outline-blue-400 shadow-lg"
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

export default Company;