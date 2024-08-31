import { NavLInk } from "react-router-dom";
import { NAVIGATION_PATH } from "../../constant/navigation";
import Profile from "../Profile/ProfileNav";
export default function PrimaryNav() {
	return (
		<nav className="primary-nav">
			<div className="primary-nav-profile">
				<Profile />
			</div>
			<div className="primary-nav-sub">
				<Nav />
			</div>

			<div className="primary-nav-logout">
				<LogOut />
			</div>
		</nav>
	);
}

function Nav() {
	return (
		<nav>
			<NavLInk to={NAVIGATION_PATH.HOME} />
			<NavLInk to={NAVIGATION_PATH.CHAT} />
			<NavLInk to={NAVIGATION_PATH.CONTACT} />
			<NavLInk to={NAVIGATION_PATH.NOTIFICATION} />
			<NavLInk to={NAVIGATION_PATH.CALENDAR} />
			<NavLInk to={NAVIGATION_PATH.SETTINGS} />
		</nav>
	);
}

function Profile({ profileImage, profileName }) {
	return (
		<div>
			<img src={profileImage} alt={profileName} />
			<span>{profileName}</span>
		</div>
	);
}
