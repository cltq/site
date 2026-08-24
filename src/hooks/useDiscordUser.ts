import { useEffect, useState } from 'react';

export interface DiscordActivity {
	name: string;
	type: string;
	details?: string | null;
	state?: string | null;
	emoji?: { name: string; id?: string; animated?: boolean } | null;
	icon?: string | null;
}

export interface DiscordUser {
	id: string;
	username: string;
	displayName: string | null;
	globalName: string | null;
	avatar: string | null;
	accentColor: string | null;
	status: string | null;
	customStatus: { text?: string; state?: string } | null;
	activities: DiscordActivity[];
}

export function useDiscordUser() {
	const [user, setUser] = useState<DiscordUser | null>(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		let cancelled = false;
		fetch('/api/discord-user')
			.then((res) => res.json())
			.then((json) => {
				if (!cancelled && json.success) {
					setUser(json.data);
				} else if (!cancelled) {
					setError(true);
				}
			})
			.catch(() => {
				if (!cancelled) setError(true);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	return { user, error };
}
