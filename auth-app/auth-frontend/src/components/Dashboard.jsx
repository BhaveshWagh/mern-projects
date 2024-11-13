import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/users");
        setUsers(res.data);
        console.log(res.data);
      } catch (error) {
        console.log("Error fetching users: ", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h2 className="text-3xl font-bold"> Dashboard</h2>
      <h2 className=" text-2xl font-bold">User List</h2>
      <ul>
        {users.map((user) => (
          <li
            className=" bg-gray-100 border border-gray-300 rounded-md p-4 my-2 shadow-sm hover:bg-gray-200 transition duration-200 ease-in-out"
            key={user._id}
          >
            <span className="font-semibold text-blue-600">{user.name}</span> -{" "}
            <span className="text-gray-700">{user.email}</span>
          </li>
        ))}
      </ul>

      <button
        className="bg-green-500 text-white px-4 py-2"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
