import {toast} from "react-toastify"
import { useState, useEffect } from "react"
export const useQuickMenuData = () => {
    const [state, setState] = useState();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8000/category");
                if (!response.ok) {
                    toast("Failed to fetch data");
                }
            } catch (err) {}
        }

        fetchData()
        
    }, [])
}
