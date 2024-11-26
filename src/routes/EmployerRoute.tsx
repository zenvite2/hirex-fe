import React from 'react';

import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { RootState } from '../redux/store';

function EmployerRoute(props) {

    const { isLoggedIn, role } = useSelector((state: RootState) => state.authReducer);

    if (!isLoggedIn || role !== 'EMPLOYER') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default EmployerRoute;