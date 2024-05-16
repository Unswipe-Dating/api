import { Profile } from '@prisma/client';

export const sortProfilesByDistance = (
  currentUserProfile: Profile,
  profiles: Profile[],
) => {
  const sortedProfiles = profiles.sort((a, b) => {
    const distanceA = Math.sqrt(
      Math.pow(
        Number(a.locationCoordinates[0]) -
          Number(currentUserProfile.locationCoordinates[0]),
        2,
      ) +
        Math.pow(
          Number(a.locationCoordinates[1]) -
            Number(currentUserProfile.locationCoordinates[1]),
          2,
        ),
    );
    const distanceB = Math.sqrt(
      Math.pow(
        Number(b.locationCoordinates[0]) -
          Number(currentUserProfile.locationCoordinates[0]),
        2,
      ) +
        Math.pow(
          Number(b.locationCoordinates[1]) -
            Number(currentUserProfile.locationCoordinates[1]),
          2,
        ),
    );
    return distanceA - distanceB;
  });
  return sortedProfiles;
};
