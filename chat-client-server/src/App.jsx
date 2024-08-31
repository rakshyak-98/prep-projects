import { Route, Routes } from "react-router-dom";
import useNavigation from "./hooks/useNavigation";

function App() {
	const navigation = useNavigation();
	return (
		<Routes>
			<Route path="/" element={<h1>Welcome</h1>} />
			<Route path={navigation.CHAT} element={<h1>Chat</h1>} />
		</Routes>
	);
}

export default App;
