import { useState } from "react";
import { servers as mockServers } from "../mockData";
export function userServer() {
	const [servers, setServer] = useState(mockServers);
	return servers;
}
