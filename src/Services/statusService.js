export const statusResponseHandler = (status,data) => {
    if(status===500){
        window.location.href = `http://localhost:3000/algoDeuErrado`
    }
    
}