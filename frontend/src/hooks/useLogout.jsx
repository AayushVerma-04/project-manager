import useAuthContext from './useAuthContext';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const {dispatch} = useAuthContext();
  const nav = useNavigate();

  const logout = ()=>{
    localStorage.removeItem("user");
    nav('/');
    dispatch({type: 'LOGOUT'});
  }
  return {logout};
}

export default useLogout