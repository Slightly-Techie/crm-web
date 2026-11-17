export type ProfileLinkField =
  | "github_profile"
  | "twitter_profile"
  | "linkedin_profile"
  | "portfolio_url";

type ProfileLinkRule = {
  placeholder: string;
  error: string;
  // A bare username is turned into `${profileBase}${username}`.
  username?: RegExp;
  profileBase?: string;
  // Hosts a full link may point to. Portfolio links may point anywhere.
  hosts?: (host: string) => boolean;
};

const oneOf =
  (...hosts: string[]) =>
  (host: string) =>
    hosts.includes(host);

export const PROFILE_LINKS: Record<ProfileLinkField, ProfileLinkRule> = {
  github_profile: {
    placeholder: "username or github.com/username",
    error: "Enter a GitHub username or a github.com link",
    // GitHub usernames: letters, digits and hyphens, not starting with a hyphen.
    username: /^@?([a-z0-9][a-z0-9-]{0,38})$/i,
    profileBase: "https://github.com/",
    hosts: oneOf("github.com", "www.github.com"),
  },
  twitter_profile: {
    placeholder: "username or x.com/username",
    error: "Enter an X username or an x.com link",
    username: /^@?([a-z0-9_]{1,15})$/i,
    profileBase: "https://x.com/",
    hosts: oneOf(
      "x.com",
      "www.x.com",
      "twitter.com",
      "www.twitter.com",
      "mobile.twitter.com"
    ),
  },
  linkedin_profile: {
    placeholder: "username or linkedin.com/in/username",
    error: "Enter a LinkedIn username or a linkedin.com/in link",
    username: /^([a-z0-9-]{3,100})$/i,
    profileBase: "https://www.linkedin.com/in/",
    // Includes country subdomains such as gh.linkedin.com.
    hosts: (host) => host === "linkedin.com" || host.endsWith(".linkedin.com"),
  },
  portfolio_url: {
    placeholder: "yourportfolio.com",
    error: "Enter a link to your site, like yourportfolio.com",
  },
};

// A scheme like "javascript:" or "https:". A digit after the colon is a port.
const URL_SCHEME = /^[a-z][a-z0-9+.-]*:(?![0-9])/i;

// Turns what someone typed into a profile link field into the link to save:
// a full https link, "" for an empty field, or null when the value is not a
// username or link for that service.
export function toProfileLink(
  field: ProfileLinkField,
  value: string | null | undefined
): string | null {
  const rule = PROFILE_LINKS[field];
  const text = (value ?? "").trim();
  if (!text) return "";
  if (/\s/.test(text)) return null;

  const username = rule.username?.exec(text);
  if (username) return `${rule.profileBase}${username[1]}`;

  let link = text;
  if (link.startsWith("//")) link = `https:${link}`;
  else if (!URL_SCHEME.test(link)) link = `https://${link}`;

  let url: URL;
  try {
    url = new URL(link);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.toLowerCase();
  if (rule.hosts) {
    // A link to a profile needs a path: "github.com" alone is not a profile.
    if (!rule.hosts(host) || url.pathname === "/") return null;
  } else if (!host.includes(".")) {
    return null;
  }
  return link;
}

// react-hook-form rules for a profile link input.
export function profileLinkRules(field: ProfileLinkField) {
  return {
    validate: (value: string) =>
      toProfileLink(field, value) !== null || PROFILE_LINKS[field].error,
  };
}
