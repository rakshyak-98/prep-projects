import { createContext } from "react";
import { NAVIGATION_PATH } from "../constant/navigation";

export const NavContext = createContext();

const  NavContextProvider = ({ children }) => {
	return (
		<NavContext.Provider value={NAVIGATION_PATH}>
			{children}
		</NavContext.Provider>
	);
};

export default NavContextProvider
