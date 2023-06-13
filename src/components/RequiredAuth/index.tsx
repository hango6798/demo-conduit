import { Navigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { setShowPopup } from "../../store/userSlice"
import { useEffect } from "react"

interface Props {
    children: any
}

export const RequiredAuth = ({children} : Props) => {
    const dispatch = useAppDispatch()
    const token = useAppSelector(store => store.userReducer.token)
    useEffect(() => {
        !token && dispatch(setShowPopup(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])
    return token ? children : <Navigate to="/"/>
}