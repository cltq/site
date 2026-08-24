export interface LastFmImage {
	'#text': string;
	size: string;
}

export interface LastFmTrack {
	name: string;
	artist: {
		name: string;
		url: string;
	};
	url: string;
	image: LastFmImage[];
	playcount: string;
}

export interface LastFmArtist {
	name: string;
	url: string;
	image: LastFmImage[];
	playcount: string;
}

export type LastFmPeriod = 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';

export type TopItemType = 'tracks' | 'artists';
