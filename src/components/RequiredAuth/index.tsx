import { Navigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { setShowPopup } from "../../store/userSlice"

interface Props {
    children: any
}

export const RequiredAuth = ({children} : Props) => {
    const dispatch = useAppDispatch()
    const token = useAppSelector(store => store.userReducer.token)
    !token && dispatch(setShowPopup(true))
    return token ? children : <Navigate to="/"/>
}