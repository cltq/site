import DiscordActivity from './DiscordActivity';
import DiscordProfile from './DiscordProfile';
import NowPlayingPanel from './NowPlayingPanel';
import SocialLinks from './SocialLinks';
import AgeText from './AgeText';

export default function HomePage() {
	return (
		<div className="profile-section">
			<div className="content-stack">
				<div className="pre-box-row">
					<DiscordProfile />
				</div>
				<div className="info-box">
					<NowPlayingPanel />
<p>
					I'm <span className="text-white">Maple, </span>
					<AgeText />
					<span className="text-white"> self-taught developer</span> and linux enthusiast. I
					love to make silly projects and learning new things.
				</p>
				</div>
				<SocialLinks />
				{/* <DiscordActivity /> */}
			</div>
		</div>
	);
}