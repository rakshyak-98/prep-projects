import { useContext } from "react";
import { NavContext } from "../contexts/NavContext";
export default function useNavigation() {
	return useContext(NavContext);
}
