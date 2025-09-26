import { useNavigate } from "react-router-dom";

function LogOutUser(){
  const navigate = useNavigate();

  const handleLogOut = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("currentUser");
    navigate("/", { replace: true });
  }
  return <button onClick={handleLogOut}>Logout</button>
}

export default LogOutUser;