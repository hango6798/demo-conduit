import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { Popup, setShowPopup } from "store/userSlice";
import { FunctionComponentElement, useEffect } from "react";

interface Props {
  children: FunctionComponentElement<any>;
}

export const RequiredAuth = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((store) => store.userReducer.user);
  useEffect(() => {
    !user &&
      dispatch(
        setShowPopup({
          name: Popup.LOGIN,
          open: true,
        })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return user ? children : <Navigate to="/" />;
};
