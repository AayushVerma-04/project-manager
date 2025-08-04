import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw Error(
      "Context can only be used if called from within a provider wrapped component"
    );
  }
  return context;
};

export default useAuthContext;
