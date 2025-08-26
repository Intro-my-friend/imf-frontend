import CoverStep from "@/app/profile/photos/CoverStep";

export default function Page() {
  return (
    <CoverStep
      mode="edit"
      backHrefOnEdit="/my"
      nextHrefOnCreate="/my"  // (사용 안 함)
    />
  );
}