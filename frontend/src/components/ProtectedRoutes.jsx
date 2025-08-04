import { Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
  const {user, loading} = useAuthContext();
  if(loading) {
    return <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50">
          <Spinner />
        </div>
  }
  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;