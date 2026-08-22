export type ContactCardIcon = "github" | "haunt" | "discord" | "email";

export interface ContactCardPlatform {
  name: string;
  icon: ContactCardIcon;
  username: string;
  description: string;
  href: string;
  copyValue: string;
}

export const githubPlatform: ContactCardPlatform = {
  name: "GitHub",
  icon: "github",
  username: "@cltq",
  description: "repos & projects",
  href: "https://github.com/cltq",
  copyValue: "cltq",
};

export const hauntPlatform: ContactCardPlatform = {
  name: "Haunt",
  icon: "haunt",
  username: "haunt.gg/fumi",
  description: "all of my links and socials",
  href: "https://haunt.gg/fumi",
  copyValue: "fumi",
};

export const discordPlatform: ContactCardPlatform = {
  name: "Discord",
  icon: "discord",
  username: "@fumiiz",
  description: "fastest way to reach me",
  href: "https://discord.com/users/969088519161139270",
  copyValue: "fumiiz",
};

export const emailPlatform: ContactCardPlatform = {
  name: "Email",
  icon: "email",
  username: "me@applefumi.xyz",
  description: "email me anytime",
  href: "mailto:me@applefumi.xyz",
  copyValue: "me@applefumi.xyz",
};
