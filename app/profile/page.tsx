"use client";

import { useState } from "react";

import ActiveArea from "@/app/profile/components/ActiveArea";
import Birth from "@/app/profile/components/Birth";
import Gender from "@/app/profile/components/Gender";
import Height from "@/app/profile/components/Height";
import Job from "@/app/profile/components/Job";
import Name from "@/app/profile/components/Name";
import Residence from "@/app/profile/components/Residence";
import Header from "@/component/Header";
import classNames from "classnames";

import $ from "./style.module.scss";

export type ProfileInputType = {
  name: string;
  gender: string;
  year: string;
  month: string;
  day: string;
  height: string;
  residenceSido: string;
  residenceGugun: string;
  activeAreaSido: string;
  activeAreaGugun: string;
  job: string;
};

export default function Profile() {
  const [step, setStep] = useState(1);
  const [profileInput, setProfileInput] = useState<ProfileInputType>({
    name: "",
    gender: "MALE",
    year: "",
    month: "",
    day: "",
    height: "",
    residenceSido: "",
    residenceGugun: "",
    activeAreaSido: "",
    activeAreaGugun: "",
    job: "",
  });

  console.log(profileInput, "zz");

  return (
    <div className={$.profile}>
      <Header text={"프로필 작성"} />
      <div className={classNames($["progress-bar"], $[`step-${step}`])}></div>
      <div className={$["input-wrapper"]}>
        <div className={$["sub-title"]}>
          이름<span className={$.required}>*</span>
        </div>
        <Name {...{ profileInput, setProfileInput }} />
        <div className={$["sub-title"]}>
          성별<span className={$.required}>*</span>
        </div>
        <Gender {...{ profileInput, setProfileInput }} />
        <div className={$["sub-title"]}>
          생년월일<span className={$.required}>*</span>
        </div>
        <Birth
          className={$["user-input"]}
          {...{ profileInput, setProfileInput }}
        />
        <div className={$["sub-title"]}>
          키<span className={$.required}>*</span>
        </div>
        <Height
          className={$["user-input"]}
          {...{ profileInput, setProfileInput }}
        />
        <div className={$["sub-title"]}>
          거주지<span className={$.required}>*</span>
        </div>
        <Residence
          className={$["user-input"]}
          {...{ profileInput, setProfileInput }}
        />
        <div className={$["sub-title"]}>
          활동지<span className={$.required}>*</span>
        </div>
        <ActiveArea
          className={$["user-input"]}
          {...{ profileInput, setProfileInput }}
        />
        <div className={$["sub-title"]}>
          직업<span className={$.required}>*</span>
        </div>
        <Job
          className={$["user-input"]}
          {...{ profileInput, setProfileInput }}
        />
      </div>
    </div>
  );
}
