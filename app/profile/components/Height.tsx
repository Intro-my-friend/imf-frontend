import { JSX } from "react";

import { ProfileInputType } from "@/app/profile/page";
import $ from "@/app/profile/style.module.scss";
import { DefaultProps } from "@/type/props";
import classNames from "classnames";

type Props = {
  profileInput: ProfileInputType;
  setProfileInput: React.Dispatch<React.SetStateAction<ProfileInputType>>;
} & DefaultProps;

function Height({ profileInput, setProfileInput }: Props): JSX.Element {
  return (
    <div className={$.inputWrapper}>
      <input
        className={classNames($["user-input"], $["height"])}
        type="number"
        placeholder="키를 입력해 주세요."
        value={profileInput?.height}
        onChange={(e) =>
          setProfileInput({ ...profileInput, height: e.target.value })
        }
      />
      <span className={$.suffix}>cm</span>
    </div>
  );
}

export default Height;
