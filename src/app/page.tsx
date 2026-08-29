import DiscordActivity from '../components/DiscordActivity';
import DiscordProfile from '../components/DiscordProfile';
import NowPlayingPanel from '../components/NowPlayingPanel';
import SocialLinks from '../components/SocialLinks';

export default function HomePage() {
	return (
		<div className="profile-section">
			<div className="content-stack">
				<DiscordActivity />
				<div className="pre-box-row">
					<DiscordProfile />
				</div>
				<div className="info-box">
					<NowPlayingPanel />
					<p>
						I'm Maple, self-taught developer and linux enthusiast. I love to make silly
						projects and learning new things.
					</p>
				</div>
				<SocialLinks />
			</div>
		</div>
	);
}