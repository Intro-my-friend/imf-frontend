import PhotosStep from "@/app/profile/photos/PhotosStep";

export default function Page() {
  return (
    <PhotosStep
      mode="edit"
      nextHrefOnCreate="/my/profile/photos/cover"  // 대표사진 선택으로 이동
      doneHrefOnEdit="/my"                 // 완료 누르면 마이로(없으면 back)
      max={5}
    />
  );
}