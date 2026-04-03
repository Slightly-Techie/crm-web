import { FieldErrors, RegisterOptions } from "react-hook-form";
import { NewUserFields } from "@/types";
import { FaXTwitter, FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa6";

type SocialsFields =
  | "twitter_profile"
  | "linkedin_profile"
  | "github_profile"
  | "portfolio_url";

type TSocialsType = Pick<NewUserFields, SocialsFields>;

type SocialsFormType = {
  register: (name: SocialsFields, options?: RegisterOptions) => {};
  errors: FieldErrors<TSocialsType>;
};

// URL validation patterns that accept either username or full URL
const SOCIAL_PATTERNS = {
  twitter: /^((?:https?:\/\/)?(?:www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]{1,15}\/?|[A-Za-z0-9_]{1,15})$/,
  github: /^((?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_-]+\/?|[A-Za-z0-9_-]+)$/,
  linkedin: /^((?:https?:\/\/)?(?:[a-z]{2,3}\.)?linkedin\.com\/in\/[\w-]+\/?|[\w-]+)$/,
  url: /^(?:https?:\/\/)?(?:www\.)?[\w-]+(\.[\w-]+)+[\w.,@?^=%&:/~+#-]*$/,
};

function Social({ register, errors }: SocialsFormType) {
  return (
    <div className="space-y-6">
      {/* Twitter/X */}
      <div>
        <label className="text-on-surface font-semibold text-sm mb-2 flex items-center gap-2">
          <FaXTwitter className="text-on-surface-variant" />
          Twitter/X Profile
        </label>
        <input
          {...register("twitter_profile", {
            pattern: {
              value: SOCIAL_PATTERNS.twitter,
              message: "Enter a valid X/Twitter username or URL"
            }
          })}
          placeholder="username or x.com/username"
          className="w-full px-4 py-3 bg-surface-container border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface placeholder:text-on-surface-variant transition-all"
          type="text"
        />
        {errors.twitter_profile && (
          <p className="text-error text-xs mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">error</span>
            Enter a valid X/Twitter username or URL
          </p>
        )}
      </div>

      {/* GitHub */}
      <div>
        <label className="text-on-surface font-semibold text-sm mb-2 flex items-center gap-2">
          <FaGithub className="text-on-surface-variant" />
          GitHub Profile
        </label>
        <input
          {...register("github_profile", {
            pattern: {
              value: SOCIAL_PATTERNS.github,
              message: "Enter a valid GitHub username or URL"
            }
          })}
          placeholder="username or github.com/username"
          className="w-full px-4 py-3 bg-surface-container border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface placeholder:text-on-surface-variant transition-all"
          type="text"
        />
        {errors.github_profile && (
          <p className="text-error text-xs mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">error</span>
            Enter a valid GitHub username or URL
          </p>
        )}
      </div>

      {/* LinkedIn */}
      <div>
        <label className="text-on-surface font-semibold text-sm mb-2 flex items-center gap-2">
          <FaLinkedin className="text-on-surface-variant" />
          LinkedIn Profile
        </label>
        <input
          {...register("linkedin_profile", {
            pattern: {
              value: SOCIAL_PATTERNS.linkedin,
              message: "Enter a valid LinkedIn username or URL"
            }
          })}
          placeholder="username or linkedin.com/in/username"
          className="w-full px-4 py-3 bg-surface-container border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface placeholder:text-on-surface-variant transition-all"
          type="text"
        />
        {errors.linkedin_profile && (
          <p className="text-error text-xs mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">error</span>
            Enter a valid LinkedIn username or URL
          </p>
        )}
      </div>

      {/* Portfolio */}
      <div>
        <label className="text-on-surface font-semibold text-sm mb-2 flex items-center gap-2">
          <FaGlobe className="text-on-surface-variant" />
          Portfolio Website
        </label>
        <input
          {...register("portfolio_url", {
            pattern: {
              value: SOCIAL_PATTERNS.url,
              message: "Enter a valid website URL"
            }
          })}
          placeholder="yourportfolio.com"
          className="w-full px-4 py-3 bg-surface-container border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-on-surface placeholder:text-on-surface-variant transition-all"
          type="text"
        />
        {errors.portfolio_url && (
          <p className="text-error text-xs mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">error</span>
            Enter a valid website URL
          </p>
        )}
      </div>
    </div>
  );
}

export default Social;
