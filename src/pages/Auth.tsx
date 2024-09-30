import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import { Office } from "../assets";
import { SignUp } from "../components";
import { RootState } from "../redux/store";

const Auth = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [open, setOpen] = useState(true);
  const location = useLocation();

  let from = location?.state?.from?.pathname || "/";

  if (user?.token) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className='w-full '>
      <img src={Office} alt='Office' className='object-contain ' />
      <SignUp open={open} setOpen={setOpen} />
    </div>
  );
};

export default Auth;