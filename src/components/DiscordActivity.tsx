import { useEffect, useRef, useState } from 'react';
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

function signature(a?: Activity | null): string {
	return a ? `${a.name}|${a.type}|${a.details ?? ''}|${a.state ?? ''}` : '';
}

export default function DiscordActivity({ activity: prop }: { activity?: Activity } = {}) {
	const { user, error } = useDiscordUser(prop ? 0 : 10000);
	const [iconFailed, setIconFailed] = useState(false);
	const [displayed, setDisplayed] = useState<Activity | null>(null);
	const [leaving, setLeaving] = useState(false);
	const timerRef = useRef<number | undefined>(undefined);

	const latest: Activity | undefined =
		prop ?? (error || !user ? undefined : user.activities.find((a) => a.name.toLowerCase() !== 'spotify' && a.type !== 'CUSTOM'));

	useEffect(() => {
		if (timerRef.current !== undefined) clearTimeout(timerRef.current);

		const finish = (next: Activity | null) => {
			timerRef.current = window.setTimeout(() => {
				setDisplayed(next);
				setLeaving(false);
				setIconFailed(false);
			}, 240);
		};

		if (latest) {
			if (!displayed) {
				setDisplayed(latest);
				setLeaving(false);
			} else if (signature(displayed) !== signature(latest)) {
				setLeaving(true);
				finish(latest);
			}
		} else if (displayed) {
			setLeaving(true);
			finish(null);
		}

		return () => {
			if (timerRef.current !== undefined) clearTimeout(timerRef.current);
		};
	}, [signature(latest)]);

	if (!displayed) return null;

	const iconUrl = resolveIcon(displayed.icon);
	const emojiUrl =
		displayed.emoji?.id && !iconFailed
			? `https://cdn.discordapp.com/emojis/${displayed.emoji.id}.${displayed.emoji.animated ? 'gif' : 'png'}`
			: null;

	return (
		<div className={`discord-activity ${leaving ? 'discord-activity--out' : 'discord-activity--in'}`}>
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
					{displayed.emoji?.name ?? displayed.name.charAt(0).toUpperCase()}
				</span>
			)}
			<div className="discord-activity__text">
				<p className="discord-activity__label">Currently</p>
				<p className="discord-activity__name">
					{displayed.type} {displayed.name}
				</p>
				{(displayed.details || displayed.state) && (
					<p className="discord-activity__details">{displayed.details ?? displayed.state}</p>
				)}
			</div>
		</div>
	);
}
