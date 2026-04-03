import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { REGEXVALIDATION } from "@/constants";
import { NewUserFields } from "@/types";

type ProfileFields =
  | "email"
  | "phone_number"
  | "first_name"
  | "last_name"
  | "username";

type TProfileType = Pick<NewUserFields, ProfileFields>;

type ProfileFormType = {
  register: UseFormRegister<NewUserFields>;
  errors: FieldErrors<TProfileType>;
  watch?: UseFormWatch<NewUserFields>;
};

function Profile({ register, errors, watch }: ProfileFormType) {
  const firstNameValue = watch?.("first_name") || "";
  const lastNameValue = watch?.("last_name") || "";
  const usernameValue = watch?.("username") || "";
  const phoneValue = watch?.("phone_number") || "";

  return (
    <>
      {/* First Name */}
      <div className="my-4">
        <label className="text-[#000] dark:text-[#f1f3f7] font-bold text-sm">
          First Name
        </label>
        <input
          className={`w-full border-[1px] mt-2 px-3 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2.5 focus:outline-none focus:border-[1px] rounded-[5px] dark:border-[#8a8a8a] transition-colors ${
            errors.first_name
              ? "border-error focus:border-error"
              : "focus:border-[#333] dark:focus:border-[#fff]"
          }`}
          type="text"
          placeholder="Enter your first name"
          {...register("first_name", {
            required: "First name is required",
            minLength: { value: 2, message: "First name must be at least 2 characters" },
            pattern: {
              value: REGEXVALIDATION.shouldNotBeEmptyString,
              message: "First name cannot be empty"
            }
          })}
        />
        {errors.first_name && (
          <small className="text-error text-xs flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-sm">error</span>
            {errors.first_name.message}
          </small>
        )}
      </div>

      {/* Last Name */}
      <div className="my-4">
        <label className="text-[#000] dark:text-[#f1f3f7] font-bold text-sm">
          Last Name
        </label>
        <input
          className={`w-full border-[1px] mt-2 px-3 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2.5 focus:outline-none focus:border-[1px] rounded-[5px] dark:border-[#8a8a8a] transition-colors ${
            errors.last_name
              ? "border-error focus:border-error"
              : "focus:border-[#333] dark:focus:border-[#fff]"
          }`}
          type="text"
          placeholder="Enter your last name"
          {...register("last_name", {
            required: "Last name is required",
            minLength: { value: 2, message: "Last name must be at least 2 characters" },
            pattern: {
              value: REGEXVALIDATION.shouldNotBeEmptyString,
              message: "Last name cannot be empty"
            }
          })}
        />
        {errors.last_name && (
          <small className="text-error text-xs flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-sm">error</span>
            {errors.last_name.message}
          </small>
        )}
      </div>

      {/* Username */}
      <div className="my-4">
        <label className="text-[#000] dark:text-[#f1f3f7] font-bold text-sm">
          Username
        </label>
        <input
          className={`w-full border-[1px] mt-2 px-3 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2.5 focus:outline-none focus:border-[1px] rounded-[5px] dark:border-[#8a8a8a] transition-colors ${
            errors.username
              ? "border-error focus:border-error"
              : "focus:border-[#333] dark:focus:border-[#fff]"
          }`}
          type="text"
          placeholder="Choose a username"
          {...register("username", {
            required: "Username is required",
            minLength: { value: 4, message: "Username must be at least 4 characters" },
            pattern: {
              value: /^[a-zA-Z0-9_.-]+$/,
              message: "Username can only contain letters, numbers, dots, hyphens and underscores"
            }
          })}
        />
        {errors.username && (
          <small className="text-error text-xs flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-sm">error</span>
            {errors.username.message}
          </small>
        )}
      </div>

      {/* Email */}
      <div className="my-4">
        <label className="text-[#000] dark:text-[#f1f3f7] font-bold text-sm">
          Email
        </label>
        <input
          className={`w-full border-[1px] mt-2 px-3 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2.5 focus:outline-none focus:border-[1px] rounded-[5px] dark:border-[#8a8a8a] transition-colors ${
            errors.email
              ? "border-error focus:border-error"
              : "focus:border-[#333] dark:focus:border-[#fff]"
          }`}
          type="email"
          placeholder="Enter your email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: REGEXVALIDATION.email,
              message: "Please enter a valid email address"
            }
          })}
        />
        {errors.email && (
          <small className="text-error text-xs flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-sm">error</span>
            {errors.email.message}
          </small>
        )}
      </div>

      {/* Phone Number */}
      <div className="my-4">
        <label className="text-[#000] dark:text-[#f1f3f7] font-bold text-sm">
          Phone Number
        </label>
        <input
          className={`w-full border-[1px] mt-2 px-3 text-[#000] dark:text-[#f1f3f7] border-[#33333380] input__transparent py-2.5 focus:outline-none focus:border-[1px] rounded-[5px] dark:border-[#8a8a8a] transition-colors ${
            errors.phone_number
              ? "border-error focus:border-error"
              : "focus:border-[#333] dark:focus:border-[#fff]"
          }`}
          type="tel"
          placeholder="0244000000"
          {...register("phone_number", {
            required: "Phone number is required",
            pattern: {
              value: REGEXVALIDATION.phoneNumberMultiple,
              message: "Please enter a valid phone number"
            }
          })}
        />
        {errors.phone_number && (
          <small className="text-error text-xs flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-sm">error</span>
            {errors.phone_number.message}
          </small>
        )}
      </div>
    </>
  );
}

export default Profile;
