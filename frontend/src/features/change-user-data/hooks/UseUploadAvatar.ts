"use client";

import { useUserControllerUploadAvatar } from "@/src/shared/api/endpoints/users/users";

export function useAvatarUploader() {
  const mutation = useUserControllerUploadAvatar();

  const upload = (file: File) => {
    console.log(file, file instanceof File);
    mutation.mutate({
      data: {
        file,
      },
    });
  };

  return { mutation, upload };
}
