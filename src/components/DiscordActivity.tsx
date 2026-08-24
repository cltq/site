import { useState } from 'react';
import { useDiscordUser, type DiscordActivity as Activity } from '../hooks/useDiscordUser';

function resolveIcon(icon?: string | null): string | null {
	if (!icon) return null;
	if (icon.startsWith('mp:external/')) {
		const [, proto, ...rest] = icon.slice('mp:external/'.length).split('/');
		if (proto !== 'https' && proto !== 'http') return null;
		return `${proto}://${rest.join('/')}`;
	}
	if (icon.startsWith('https://') || icon.startsWith('http://')) return icon;
	return null;
}

export default function DiscordActivity({ activity: prop }: { activity?: Activity } = {}) {
	const { user, error } = useDiscordUser();
	const [iconFailed, setIconFailed] = useState(false);

	const activity: Activity | undefined = prop ?? (error || !user ? undefined : user.activities[0]);
	if (!activity) return null;

	const iconUrl = resolveIcon(activity.icon);
	const emojiUrl =
		activity.emoji?.id && !iconFailed
			? `https://cdn.discordapp.com/emojis/${activity.emoji.id}.${activity.emoji.animated ? 'gif' : 'png'}`
			: null;

	return (
		<div className="discord-activity">
			{iconUrl && !iconFailed ? (
				<img
					className="discord-activity__icon"
					src={iconUrl}
					alt=""
					onError={() => setIconFailed(true)}
				/>
			) : emojiUrl ? (
				<img
					className="discord-activity__icon discord-activity__icon--emoji"
					src={emojiUrl}
					alt=""
					onError={() => setIconFailed(true)}
				/>
			) : (
				<span className="discord-activity__icon discord-activity__icon--fallback">
					{activity.emoji?.name ?? activity.name.charAt(0).toUpperCase()}
				</span>
			)}
			<div className="discord-activity__text">
				<p className="discord-activity__label">Currently</p>
				<p className="discord-activity__name">
					{activity.type} {activity.name}
				</p>
				{(activity.details || activity.state) && (
					<p className="discord-activity__details">{activity.details ?? activity.state}</p>
				)}
			</div>
		</div>
	);
}
