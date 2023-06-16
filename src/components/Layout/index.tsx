import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { fetchUser } from "@store/userSlice";

export const Layout = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((store) => store.userReducer);
  useEffect(() => {
    token && dispatch(fetchUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div>
      <Header />
      <Outlet />
      <div className="footer"></div>
    </div>
  );
};
