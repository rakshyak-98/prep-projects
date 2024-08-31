import { userServer } from "../../hooks/useServer";
export default function Dashboard() {
	return (
		<section className="dashboard dashboard-grid">
			<Servers />
			<ServerState />
			<FileTransferStatus />
			<Monitoring />
		</section>
	);
}

function Servers() {
	const servers = userServer();
	return (
		<section className="dashboard-grid-servers">
			{servers.map((server) => (
				<Server key={server.id} id={server.id} server={server} />
			))}
		</section>
	);
}

function Server({ server }) {
	return <section>{server.name}</section>;
}
function ServerState() {
	return (
		<section className="dashboard-grid-server-status">ServerState</section>
	);
}

function FileTransferStatus() {
	return (
		<section className="dashboard-grid-file-transfer-status">
			FileTransferStatus
		</section>
	);
}

function Monitoring() {
	return <section className="dashboard-grid-monitoring">Monitoring</section>;
}
