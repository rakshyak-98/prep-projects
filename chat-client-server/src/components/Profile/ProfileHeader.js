export function Profile({ profileImage, profileName }) {
	return (
		<div>
			<img src={profileImage} alt={profileName} />
			<span>{profileName}</span>
		</div>
	);
}
