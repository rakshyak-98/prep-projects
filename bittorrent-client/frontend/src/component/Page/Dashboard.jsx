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

function Server({ server: { name, stat, lastUpTime, lastDownTime } }) {
	return (
		<div className="server-card">
			<span className="server-card-server-name">{name}</span>
			<div className="server-card-stat">
				<img src={`/server-${stat}`} alt={`server ${stat} icon`} />
				<span className={stat}>{stat}</span>
			</div>
			<span className="server-card-state-time">
				{stat === "up" ? lastDownTime : lastUpTime}
			</span>
		</div>
	);
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
