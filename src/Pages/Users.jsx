import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../Componenets/Navbar";
import Sidebar from "../Componenets/Sidebar";

const Users = () => {
  let navigate = useNavigate();
  let [users, setUsers] = useState()
  let [deleted, setDeleted] = useState(true)
  
  useEffect(() => {
    if (!localStorage.getItem("admin-token")) return navigate("/log-in-admin");
    async function getUsers(){
      try {
        let {data} = await axios.get('/users')
        setUsers(data)
      } catch (error) {
        console.log(error);
      }
    }
    getUsers()
  }, [deleted]);

  async function handleDelete(id){
    let token = localStorage.getItem("admin-token")
    if(!token) return;

    let confirmation = confirm("Are you sure remove this user?")
    if(!confirmation) return;

    let res = await axios.delete(`/delete-user/${id}`, {headers:{token}})

    if(res.status === 200){
      toast(res.data, {type:"info"})
      setDeleted(!deleted)
    }
    
  }
  
  return (
    <>
      <Navbar />
      <div>
        <Sidebar />
        <div className="pl-72 py-5 pr-8">
            <h2 className="text-center text-5xl font-semibold pb-3">Users list</h2>
          <table className="bg-slate-200 w-full text-center rounded-lg">
            
            <thead className="bg-slate-400 text-lg">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Logged in date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users?.map?.((user, ind)=>{
              return <tr key={user?.id} className="border-t border-white">
                <td>{ind+1}</td>
                <td>{user?.name}</td>
                <td>{user?.email}</td>
                <td>{user?.login_date.slice(0,10)}</td>
                <td>
                  <i onClick={()=>handleDelete(user?.id)} className="fa-solid fa-trash my-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-500 active:bg-red-400"></i>
                </td>
              </tr>
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Users;
