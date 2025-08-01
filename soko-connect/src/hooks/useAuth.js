
import { useState } from "react";
import { fetchData } from "../utils/fetchAPI";
import { useNavigate } from "react-router-dom";


export const useAuth = () => {
 const [errorMessage, setErrorMessage] = useState('');
 const navigate = useNavigate();


 const login = async (phone_number, password) => {
   setErrorMessage('');
   try {
     const data = await fetchData('login/', 'POST', { phone_number, password });
     if (data.token) {
       localStorage.setItem('access_token', data.token);
       localStorage.setItem('user', JSON.stringify({
         usertype: data.usertype,
         full_name: data.full_name,
         phone_number: data.phone_number,
       }));
       navigate('/dashboard');
       return true;
     } else {
       setErrorMessage('Login failed: token not received');
       return false;
     }
   } catch (error) {
     setErrorMessage(error.message === "Something went wrong: 400" ?
       "Invalid phone number or password" :
       "Network error, please try again.");
     return false;
   }
 };


 return { login, errorMessage, setErrorMessage };
};
