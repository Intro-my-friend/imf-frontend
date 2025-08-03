import { ProfileInputType } from "@/app/profile/page";
import $ from "@/app/profile/style.module.scss";
import { DefaultProps } from "@/type/props";
import classNames from "classnames";

type Props = {
  profileInput: ProfileInputType;
  setProfileInput: React.Dispatch<React.SetStateAction<ProfileInputType>>;
} & DefaultProps;

function Job({ profileInput, setProfileInput }: Props): React.ReactElement {
  return (
    <input
      className={classNames($["user-input"], $["job"])}
      type={"text"}
      placeholder={"직업을 입력해주세요."}
      value={profileInput?.job}
      onChange={(e) =>
        setProfileInput({ ...profileInput, job: e.target.value })
      }
    />
  );
}

export default Job;
