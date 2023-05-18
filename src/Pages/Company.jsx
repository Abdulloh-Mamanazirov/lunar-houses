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
  let imageModal = useRef()
  let [loading, setLoading] = useState(false);
  let [refresh, setRefresh] = useState(true);
  let [modalImage, setModalImage] = useState();
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
    setLoading(true)
    
    let file = new FormData();
    file.append("file", image);
    file.append("upload_preset", "houses");

    let res = await axios.post(
      "https://api.cloudinary.com/v1_1/dpk4vtr8p/image/upload",file).catch(error=>{return toast("Error in uploading the image",{type:"error"})});
    if (res.status === 200) {
      let response = await axios.post("/add-company", {name:company, image:res?.data?.secure_url}, {
        headers:{
          token:localStorage.getItem("admin-token")
        }
      }).then((response) => {setLoading(false); return response}).catch(function (error) {
        if (error) {
          toast(error?.response?.data?.details?.[0]?.message || error?.response?.data, {type: "error",});
          return setLoading(false);
        }
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
                capture={true}
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
            disabled={loading}
              type="submit"
              className="p-1 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500"
            >
              {!loading ? "Submit" : <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
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
              {companyList?.length > 0 ? companyList?.map?.((company, ind) => {
                return (
                  <tr key={company?.id} className="border-t border-white">
                    <td>{ind + 1}</td>
                    <td>{company?.name}</td>
                    <td>
                      <img
                        onClick={(e) => {
                          imageModal.current.showModal();
                          setModalImage(e.target.src);
                        }}
                        className="mx-auto cursor-pointer"
                        src={company?.image}
                        width={70}
                        alt="image"
                      />
                    </td>
                    <td>
                      <i
                        onClick={() => handleDelete(company?.id)}
                        className="fa-solid fa-trash my-1 cursor-pointer bg-red-600 text-white p-3 rounded-lg hover:bg-red-500 active:bg-red-400"
                      ></i>
                      <i
                        onClick={() => {
                          setCompnayData(company);
                          dialog.current.showModal();
                        }}
                        className="fa-solid fa-edit my-1 ml-2 cursor-pointer bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-500 active:bg-blue-400"
                      ></i>
                    </td>
                  </tr>
                );
              }) : new Array(5).fill(1).map(a=>{
                return <tr key={crypto.randomUUID()} className="border-y-4 ">
                <td className="border-x-4 bg-gray-400 bg-opacity-70 w-3 p-1 animate-pulse"><span></span></td>
                <td className="border-x-4 bg-gray-400 bg-opacity-70 w-16 p-1 animate-pulse"><span></span></td>
                <td className="border-x-4 bg-gray-400 bg-opacity-70 w-10 p-1 animate-pulse"><span></span></td>
                <td className="border-x-4 bg-gray-400 bg-opacity-70 w-5 p-1 animate-pulse"><span> </span></td>
              </tr>
              })}
            </tbody>
          </table>
        </div>
      </div>
      <dialog
        ref={dialog}
        className="backdrop:bg-black backdrop:bg-opacity-40 border rounded-xl"
      >
        <form onSubmit={handleUpdate} className="flex flex-col gap-3">
          <h2 className="text-center text-2xl font-semibold">Edit Company</h2>
          <input
            defaultValue={companyData?.name}
            onChange={(e) => setCompany(e.target.value)}
            className="w-72 rounded-lg border border-blue-400 p-1 outline-blue-400 shadow-lg"
          />
          <div>
            <button
              className="border bg-red-500 text-white rounded-md px-3 py-1"
              formMethod="dialog"
              type="reset"
              onClick={() => dialog.current.close()}
            >
              Cancel
            </button>
            <button
              className="border bg-blue-600 text-white rounded-md px-3 py-1 ml-2"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </dialog>
      <dialog
        ref={imageModal}
        className="backdrop:bg-black backdrop:bg-opacity-50 rounded-xl relative"
      >
        <i
          className="fa-regular fa-xmark absolute top-0 right-0 bg-red-500 font-bold text-gray-300 py-2 px-5"
          onClick={() => imageModal.current.close()}
        ></i>
        <img
          className="max-w-[700px] border border-gray-500 rounded-lg"
          src={modalImage}
          alt="image"
        />
      </dialog>
    </>
  );
};

export default Company;