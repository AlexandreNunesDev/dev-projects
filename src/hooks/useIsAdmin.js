import { useSelector } from "react-redux"

const useIsAdmin = () => {
    const isAdmin =  useSelector(state => state.global.userRole)
    if(isAdmin === "ADMIN_ROLE") return true
    return false
}

export default useIsAdmin