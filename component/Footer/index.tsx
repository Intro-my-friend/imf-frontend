"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Icon from "@/component/Icon";
import classNames from "classnames";

import $ from "./style.module.scss";

function Footer() {
  return (
    <div className={$.footer}>
      <Link
        href={"/match"}
        className={classNames($.match, {
          [$["active"]]: window.location.href.includes("/match"),
        })}
      >
        <Icon size={24} name={"heart"} /> 매칭
      </Link>
      <Link
        href={"/friend"}
        className={classNames($.friend, {
          [$["active"]]: window.location.href.includes("/friend"),
        })}
      >
        <Icon size={24} name={"person"} /> 지인
      </Link>
      <Link
        href={"/my"}
        className={classNames($.my, {
          [$["active"]]: window.location.href.includes("/my"),
        })}
      >
        <Icon size={24} name={"my"} /> 마이
      </Link>
    </div>
  );
}

export default Footer;
