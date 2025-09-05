import { ProfileInputType } from "@/app/profile/form/ProfileForm";
import $ from "@/app/profile/form/style.module.scss";
import { DefaultProps } from "@/type/props";
import classNames from "classnames";

type Props = {
  profileInput: ProfileInputType;
  setProfileInput: React.Dispatch<React.SetStateAction<ProfileInputType>>;
} & DefaultProps;

function Name({ profileInput, setProfileInput }: Props): React.ReactElement {
  return (
    <input
      className={classNames($["user-input"], $["name"])}
      type={"text"}
      placeholder={"이름을 입력해주세요."}
      value={profileInput?.name}
      onChange={(e) =>
        setProfileInput({ ...profileInput, name: e.target.value })
      }
    />
  );
}

export default Name;
