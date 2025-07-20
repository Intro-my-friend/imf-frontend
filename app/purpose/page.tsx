"use client";

import Header from "@/component/Header";

import $ from "./style.module.scss";

export default function Purpose() {
  return (
    <div className={$.purpose}>
      <Header text={"사용 목적"} />
      <div className={$["only-with"]}>
        <div className={$.only}>
          <div className={$.radio}></div>
          <div className={$.infos}>
            <div className={$.title}>주선만 하기</div>
            <div className={$.description}>
              다른 사람들만 소개해주고 본인은 소개받지 않음
            </div>
          </div>
        </div>
        <div className={$.with}>
          <div className={$.radio}></div>
          <div className={$.infos}>
            <div className={$.title}>주선하면서 소개도 받기</div>
            <div className={$.description}>
              다른 사람들도 소개하고 본인도 소개받기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
