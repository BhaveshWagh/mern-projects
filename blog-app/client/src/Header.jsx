import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  // const [username, setUsername] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        // setUsername(userInfo.username);
        setUserInfo(userInfo);
      });
    });
  }, []);

  function handleLogout() {
    fetch("http://localhost:8000/logout", {
      credentials: "include",
      method: "POST",
    });
    
    setUserInfo(null);
  }
  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        MyBlog
      </Link>
      <nav>
        {username && (
          <>
          <span>Hello, {username}</span>
            <Link to="/create">Create new post</Link>
            <a onClick={handleLogout}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}
