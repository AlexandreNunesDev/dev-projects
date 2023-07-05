import { useSelector } from "react-redux"

const useIsAdmin = () => {
    const isAdmin =  useSelector(state => state.global.userRole)
    if(isAdmin === "ADMIN_ROLE") return false
    return true
}

export default useIsAdmin