'use client';

import { useDiscordUser } from '../hooks/useDiscordUser';

export default function DiscordProfile() {
	const { user, error } = useDiscordUser();

	if (error) {
		return (
			<div className="discord-profile">
				<p className="discord-profile__message">Failed to load profile</p>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="discord-profile">
				<div className="discord-profile__header">
					<div className="discord-profile__skeleton discord-profile__skeleton--avatar" />
					<div>
						<div className="discord-profile__skeleton discord-profile__skeleton--name" />
						<div className="discord-profile__skeleton discord-profile__skeleton--username" />
					</div>
				</div>
			</div>
		);
	}

	const name = user.displayName ?? user.globalName ?? user.username;
	const customText = user.customStatus?.text ?? user.customStatus?.state;

	return (
		<div className="discord-profile">
			<div className="discord-profile__header">
				{user.avatar ? (
					<img className="discord-profile__avatar" src={user.avatar} alt={name} width={32} height={32} />
				) : (
					<div
						className="discord-profile__avatar discord-profile__avatar--fallback"
						style={{ background: user.accentColor ?? '#5865f2' }}
					>
						{name.charAt(0).toUpperCase()}
					</div>
				)}
				<div className="discord-profile__identity">
					<h3 className="discord-profile__name">{name}</h3>
					<a
						className="discord-profile__username"
						href={`https://discord.com/users/${user.id}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						@{user.username}
					</a>
				</div>
			</div>
			{customText && <p className="discord-profile__custom-status">{customText}</p>}
		</div>
	);
}