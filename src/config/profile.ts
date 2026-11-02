import profileData from "./profile.json";

export const profile = {
  ...profileData,
  emailHref: `mailto:${profileData.email}`,
  phoneHref: `tel:${profileData.phone}`,
};
