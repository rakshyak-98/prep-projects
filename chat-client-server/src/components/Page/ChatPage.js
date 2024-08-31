export default function ChatPage() {
	return (
		<section className="chat-page">
			<header>
				<span>Chats</span> <button>Create New Chat</button>
				<input type="chat-page-search" placeholder="Search" />
				<select>
					<option>message from: person1</option>
				</select>
			</header>
			<section></section>
		</section>
	);
}

function ChatCard({ profile, message }) {
	return (
		<div>
			<header></header>
			<div>
				<Text value={message} />
			</div>
		</div>
	);
}
