import { JSX } from "react";

import { ProfileInputType } from "@/app/profile/page";
import $ from "@/app/profile/style.module.scss";
import { DefaultProps } from "@/type/props";
import classNames from "classnames";

type Props = {
  profileInput: ProfileInputType;
  setProfileInput: React.Dispatch<React.SetStateAction<ProfileInputType>>;
} & DefaultProps;

function Gender({ profileInput, setProfileInput }: Props): JSX.Element {
  return (
    <div className={classNames($["user-input"], $.gender)}>
      <div
        className={classNames(
          $.male,
          profileInput?.gender === "MALE" && $.active,
        )}
        onClick={() => setProfileInput({ ...profileInput, gender: "MALE" })}
      >
        남자
      </div>
      <div
        className={classNames(
          $.female,
          profileInput?.gender === "FEMALE" && $.active,
        )}
        onClick={() => setProfileInput({ ...profileInput, gender: "FEMALE" })}
      >
        여자
      </div>
    </div>
  );
}

export default Gender;
