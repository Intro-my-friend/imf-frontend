"use client";

import { useState } from "react";

import Header from "@/component/Header";
import classNames from "classnames";

import $ from "./style.module.scss";

export default function Profile() {
  const [step, setStep] = useState(1);

  return (
    <div className={$.profile}>
      <Header text={"프로필 작성"} />
      <div className={classNames($["progress-bar"], $[`step-${step}`])}></div>
    </div>
  );
}
