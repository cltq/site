'use client';

import { useEffect, useState } from 'react';

const BIRTHDATE_MS = new Date('2010-12-31T13:12:00+07:00').getTime();
const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;

interface Age {
	whole: number;
	exact: string;
}

export default function AgeText() {
	const getAge = (): Age => {
		const years = (Date.now() - BIRTHDATE_MS) / MS_PER_YEAR;
		return { whole: Math.floor(years), exact: years.toFixed(9) };
	};

	const [age, setAge] = useState<Age | null>(null);

	useEffect(() => {
		const update = () => setAge(getAge());
		update();
		const id = setInterval(update, 100);
		return () => clearInterval(id);
	}, []);

	return (
		<span className="group relative inline-block cursor-help text-white">
			{age ? `${age.whole} yo` : '-- yo'}
			<span
				className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-gray-900 px-1.5 py-0.5 text-[10px] font-normal text-white shadow-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100"
				aria-hidden="true"
			>
				{age?.exact ?? ''}
			</span>
		</span>
	);
}