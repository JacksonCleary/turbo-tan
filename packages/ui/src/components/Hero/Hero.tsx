import { Button } from "@repo/ui/components/Button";
import { Download, Heart, Settings, Trash2 } from "lucide-react";
import styles from "./Hero.module.css";

function ButtonExamples() {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "2rem",
				padding: "2rem",
			}}
		>
			{/* Text-only buttons - different sizes */}
			<div style={{ alignItems: "center", display: "flex", gap: "1rem" }}>
				<Button size="xs">Extra Small</Button>
				<Button size="sm">Small</Button>
				<Button size="default">Default</Button>
				<Button size="lg">Large</Button>
			</div>

			{/* Different variants */}
			<div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
				<Button variant="default">Default</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="ghost">Ghost</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="destructive">Destructive</Button>
				<Button variant="link">Link</Button>
			</div>

			{/* Buttons with inline icons */}
			<div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
				<Button>
					<Download />
					Download File
				</Button>

				<Button variant="outline">
					Save Changes
					<Heart />
				</Button>

				<Button size="sm" variant="destructive">
					<Trash2 />
					Delete
				</Button>
			</div>

			{/* Icon-only buttons - different sizes */}
			<div style={{ alignItems: "center", display: "flex", gap: "1rem" }}>
				<Button size="icon-xs" variant="ghost">
					<Settings />
				</Button>

				<Button size="icon-sm" variant="outline">
					<Heart />
				</Button>

				<Button size="icon">
					<Download />
				</Button>

				<Button size="icon-lg" variant="secondary">
					<Settings />
				</Button>
			</div>

			{/* Combined: variants + sizes + icons */}
			<div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
				<Button size="lg" variant="outline">
					<Download />
					Download Report
				</Button>

				<Button size="sm" variant="destructive">
					<Trash2 />
					Remove
				</Button>

				<Button size="xs" variant="ghost">
					<Settings />
					Settings
				</Button>
			</div>

			{/* Disabled state */}
			<div style={{ display: "flex", gap: "1rem" }}>
				<Button disabled>Disabled</Button>
				<Button disabled variant="outline">
					<Download />
					Disabled with Icon
				</Button>
			</div>
		</div>
	);
}

export function Hero() {
	return (
		<div className={styles["container"]}>
			<div className={styles["video-container"]}>
				<video autoPlay loop muted playsInline>
					<source src="/duck.mp4" type="video/mp4" />
					Your browser does not support the video tag :[
				</video>
			</div>
			<ButtonExamples />
		</div>
	);
}
