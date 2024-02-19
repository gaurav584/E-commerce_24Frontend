import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  children?: ReactElement;
  isAuthenticated: boolean;
  adminOnly?: boolean;
  admin?: boolean;
  redirect?: string;
}

const ProtectedRoute = ({
  isAuthenticated,
  children,
  adminOnly,
  admin,
  redirect="/",
}: Props) => {
    
    // check-user is Login or not
    if(!isAuthenticated) return <Navigate to={redirect}/>;

    // check login-user is admin or not 
    if(adminOnly && !admin) return <Navigate to={redirect}/>;

  return children  ? children : <Outlet/>;
};

export default ProtectedRoute;
