import { useEffect, useState } from 'react';
import type { DiscordActivity, DiscordResponse, DiscordUserData } from '../lib/integrations';

interface DiscordProfileCardProps {
	endpoint?: string;
	refreshIntervalMs?: number;
}

const STATUS_COLORS: Record<string, string> = {
	online: 'bg-green-400',
	idle: 'bg-yellow-400',
	dnd: 'bg-red-400',
	offline: 'bg-zinc-500',
};

const BADGE_LABELS: Record<string, string> = {
	HypeSquadOnlineHouse1: 'Bravery',
	HypeSquadOnlineHouse2: 'Brilliance',
	HypeSquadOnlineHouse3: 'Balance',
	HypeSquadEvents: 'HypeSquad Events',
	Subscriber: 'Nitro',
	Partner: 'Discord Partner',
	BugHunterLevel1: 'Bug Hunter',
	BugHunterLevel2: 'Bug Hunter Gold',
	ActiveDeveloper: 'Active Developer',
	VerifiedDeveloper: 'Early Developer',
	Staff: 'Discord Staff',
};

function ActivityIcon({ activity }: { activity: DiscordActivity }) {
	if (activity.emoji) {
		return <span aria-hidden="true">{activity.emoji}</span>;
	}
	if (activity.icon) {
		return (
			<img
				src={`https://cdn.discordapp.com/${activity.icon}`}
				alt=""
				width={20}
				height={20}
				className="h-5 w-5 rounded"
			/>
		);
	}
	return (
		<span
			className="flex h-5 w-5 items-center justify-center rounded bg-zinc-700 text-[10px] font-bold text-zinc-300"
			aria-hidden="true"
		>
			{activity.name.charAt(0)}
		</span>
	);
}

function formatDuration(ms: number): string {
	return Math.floor(ms / 1000) + 's';
}

function activityRunTime(activity: DiscordActivity): string {
	const timestamps = activity.timestamps;
	if (!timestamps?.start) return '';
	const elapsed = Date.now() - timestamps.start;
	return elapsed > 0 ? formatDuration(elapsed) : '';
}

function ActivityLine({ activity }: { activity: DiscordActivity }) {
	const [elapsed, setElapsed] = useState(activityRunTime(activity));

	useEffect(() => {
		setElapsed(activityRunTime(activity));
		const timer = setInterval(() => setElapsed(activityRunTime(activity)), 1000);
		return () => clearInterval(timer);
	}, [activity]);

	return (
		<li className="flex items-start gap-3 py-2">
			<ActivityIcon activity={activity} />
			<div className="min-w-0 flex-1">
				<p className="truncate text-xs font-semibold text-zinc-200">{activity.name}</p>
				{activity.details && <p className="truncate text-xs text-zinc-400">{activity.details}</p>}
				{activity.state && <p className="truncate text-xs text-zinc-500">{activity.state}</p>}
			</div>
			{elapsed && <span className="shrink-0 text-[11px] tabular-nums text-zinc-500">{elapsed}</span>}
		</li>
	);
}

function DiscordSpotifyStatus({ spotify }: { spotify: NonNullable<DiscordUserData['spotify']> }) {
	const [progressMs, setProgressMs] = useState(() =>
		Math.max(0, Math.min(Date.now() - spotify.startedAt, spotify.endsAt - spotify.startedAt)),
	);

	useEffect(() => {
		const update = () =>
			setProgressMs(Math.max(0, Math.min(Date.now() - spotify.startedAt, spotify.endsAt - spotify.startedAt)));
		update();
		const timer = setInterval(update, 1000);
		return () => clearInterval(timer);
	}, [spotify]);

	const totalMs = spotify.endsAt - spotify.startedAt;
	const percent = totalMs > 0 ? (progressMs / totalMs) * 100 : 0;

	return (
		<li className="flex items-center gap-3 border-t border-zinc-800 py-3">
			{spotify.cover && (
				<img
					src={spotify.cover}
					alt=""
					width={40}
					height={40}
					className="h-10 w-10 rounded-md object-cover"
				/>
			)}
			<div className="min-w-0 flex-1">
				<p className="truncate text-xs font-semibold text-green-400">Listening to Spotify</p>
				<p className="truncate text-xs font-semibold text-zinc-200">{spotify.song}</p>
				<p className="truncate text-xs text-zinc-500">
					{spotify.artist} — {spotify.album}
				</p>
				<div className="mt-1.5 flex items-center gap-2">
					<div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
						<div
							className="h-full rounded-full bg-green-400"
							style={{ width: `${percent}%` }}
						/>
					</div>
				</div>
			</div>
		</li>
	);
}

export default function DiscordProfileCard({
	endpoint = '/api/discord',
	refreshIntervalMs = 30_000,
}: DiscordProfileCardProps) {
	const [user, setUser] = useState<DiscordUserData | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				const response = await fetch(endpoint);
				if (!response.ok) {
					const body = (await response.json().catch(() => null)) as { error?: string } | null;
					throw new Error(body?.error ?? `Request failed with ${response.status}`);
				}
				const json = (await response.json()) as DiscordResponse | { error: string };
				if (cancelled) return;

				if ('error' in json) {
					setError(json.error);
					return;
				}
				if (!json.success) {
					throw new Error('Discord API returned unsuccessful response');
				}

				setUser(json.data);
				setError(null);
			} catch (err) {
				if (cancelled) return;
				setError(err instanceof Error ? err.message : 'Failed to load Discord profile');
			}
		}

		void load();
		const timer = setInterval(() => void load(), refreshIntervalMs);

		return () => {
			cancelled = true;
			clearInterval(timer);
		};
	}, [endpoint, refreshIntervalMs]);

	if (error) {
		return (
			<div className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">
				<span className="font-semibold text-zinc-500">Discord</span>
				<p className="mt-1">Unable to load: {error}</p>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">
				<span className="font-semibold text-zinc-500">Discord</span>
				<p className="mt-1">Loading profile…</p>
			</div>
		);
	}

	const statusColor = STATUS_COLORS[user.status] ?? STATUS_COLORS.offline;
	const badges = user.badges
		.map((badge) => BADGE_LABELS[badge] ?? null)
		.filter((label): label is string => label !== null);

	return (
		<div className="w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
			<div
				className="h-20 w-full bg-cover bg-center"
				style={{
					backgroundImage: user.banner
						? `linear-gradient(180deg, transparent 0%, rgba(9,9,11,0.85) 100%), url(${user.banner})`
						: 'none',
					backgroundColor: user.accentColor ? undefined : '#18181b',
				}}
			/>
			<div className="px-4 pb-4">
				<div className="-mt-8 flex items-end gap-3">
					<img
						src={user.avatar}
						alt={user.displayName}
						width={64}
						height={64}
						className="h-16 w-16 shrink-0 rounded-full border-4 border-zinc-900 object-cover"
					/>
					<div className="mb-0.5 flex items-center gap-2">
						<span
							className={`relative inline-flex h-3 w-3 rounded-full ${statusColor} ring-2 ring-zinc-900`}
						>
							{user.status === 'online' && (
								<span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-60" />
							)}
						</span>
					</div>
				</div>
				<div className="mt-3">
					<div className="flex items-center gap-2">
						<h3 className="text-base font-bold text-white">{user.displayName}</h3>
						<span className="text-sm text-zinc-500">@{user.username}</span>
					</div>
					{badges.length > 0 && (
						<div className="mt-2 flex flex-wrap gap-1.5">
							{badges.map((badge) => (
								<span
									key={badge}
									className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-300"
								>
									{badge}
								</span>
							))}
						</div>
					)}
					{user.boostBadge && (
						<p className="mt-1 text-xs text-zinc-400">Boosting {user.guildName}</p>
					)}
					{user.customStatus && (
						<p className="mt-2 text-sm text-zinc-300">“{user.customStatus}”</p>
					)}
				</div>
				{(user.spotify || user.activities.length > 0) && (
					<ul className="mt-3 divide-y divide-zinc-800/70 border-t border-zinc-800">
						{user.spotify && <DiscordSpotifyStatus spotify={user.spotify} />}
						{user.activities.map((activity) => (
							<ActivityLine key={activity.applicationId ?? activity.name} activity={activity} />
						))}
					</ul>
				)}
			</div>
		</div>
	);
}