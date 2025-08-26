import PhotosStep from "./PhotosStep";

export default function Page() {
  return (
    <PhotosStep
      mode="create"
      nextHrefOnCreate="/profile/photos/cover"
      max={5}
    />
  );
}