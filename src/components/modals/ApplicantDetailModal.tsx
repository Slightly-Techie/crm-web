"use client";

import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";

interface ApplicantDetailModalProps {
  applicant: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicantDetailModal({
  applicant,
  isOpen,
  onClose,
}: ApplicantDetailModalProps) {
  if (!isOpen || !applicant) return null;

  const profilePicUrl =
    applicant.profile_pic_url ||
    `https://api.dicebear.com/7.x/initials/jpg?seed=${applicant.first_name} ${applicant.last_name}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-surface-container-lowest border-b border-outline p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Image
                className="w-16 h-16 rounded-full object-cover ring-2 ring-primary"
                width={64}
                height={64}
                src={profilePicUrl}
                alt={`${applicant.first_name} ${applicant.last_name}`}
              />
              <div>
                <h2 className="text-xl font-headline font-bold text-on-surface">
                  {applicant.first_name} {applicant.last_name}
                </h2>
                <p className="text-sm text-on-surface-variant">
                  @{applicant.username || applicant.email?.split("@")[0]}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant"
            >
              <AiOutlineClose size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-high">
                <span className="material-symbols-outlined text-primary">email</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-on-surface-variant">Email</p>
                  <p className="text-sm font-medium text-on-surface truncate">
                    {applicant.email || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-high">
                <span className="material-symbols-outlined text-primary">phone</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-on-surface-variant">Phone</p>
                  <p className="text-sm font-medium text-on-surface">
                    {applicant.phone_number || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
              Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-high">
                <span className="material-symbols-outlined text-primary">work_history</span>
                <div className="flex-1">
                  <p className="text-xs text-on-surface-variant">Experience</p>
                  <p className="text-sm font-medium text-on-surface">
                    {applicant.years_of_experience !== null && applicant.years_of_experience !== undefined
                      ? `${applicant.years_of_experience} year${applicant.years_of_experience !== 1 ? "s" : ""}`
                      : "Not specified"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-high">
                <span className="material-symbols-outlined text-primary">code</span>
                <div className="flex-1">
                  <p className="text-xs text-on-surface-variant">Stack</p>
                  <p className="text-sm font-medium text-on-surface">
                    {applicant.stack?.name || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          {applicant.skills && applicant.skills.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {applicant.skills.map((skill: any, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    {skill.name || skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {applicant.tags && applicant.tags.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {applicant.tags.map((tag: any, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-medium"
                  >
                    {tag.name || tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {applicant.bio && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                Bio
              </h3>
              <p className="text-sm text-on-surface leading-relaxed p-4 rounded-lg bg-surface-container-high">
                {applicant.bio}
              </p>
            </div>
          )}

          {/* Social Links */}
          {(applicant.github_profile || applicant.linkedin_profile || applicant.portfolio_url || applicant.twitter_profile) && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
                Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {applicant.github_profile && (
                  <a
                    href={applicant.github_profile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-high hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant">code</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-on-surface-variant">GitHub</p>
                      <p className="text-sm font-medium text-primary truncate">
                        {applicant.github_profile.replace("https://", "")}
                      </p>
                    </div>
                  </a>
                )}
                {applicant.linkedin_profile && (
                  <a
                    href={applicant.linkedin_profile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-high hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant">work</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-on-surface-variant">LinkedIn</p>
                      <p className="text-sm font-medium text-primary truncate">
                        {applicant.linkedin_profile.replace("https://", "")}
                      </p>
                    </div>
                  </a>
                )}
                {applicant.portfolio_url && (
                  <a
                    href={applicant.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-high hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant">language</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-on-surface-variant">Portfolio</p>
                      <p className="text-sm font-medium text-primary truncate">
                        {applicant.portfolio_url.replace("https://", "")}
                      </p>
                    </div>
                  </a>
                )}
                {applicant.twitter_profile && (
                  <a
                    href={applicant.twitter_profile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-high hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant">chat</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-on-surface-variant">Twitter</p>
                      <p className="text-sm font-medium text-primary truncate">
                        {applicant.twitter_profile.replace("https://", "")}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Application Status */}
          <div className="space-y-3 pt-4 border-t border-outline">
            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
              Application Status
            </h3>
            <div className="flex items-center justify-between p-4 rounded-lg bg-surface-container-high">
              <div>
                <p className="text-xs text-on-surface-variant">Current Status</p>
                <p className="text-sm font-bold text-on-surface mt-1">
                  {applicant.status || applicant.user_status || "Pending"}
                </p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Account Active</p>
                <p className="text-sm font-bold text-on-surface mt-1">
                  {applicant.is_active ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface-container-lowest border-t border-outline p-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
