"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Icon from "@/component/Icon";
import classNames from "classnames";

import $ from "./style.module.scss";

function Footer() {
  const pathname = usePathname();

  return (
    <div className={$.footer}>
      <Link
        href={"/match"}
        className={classNames($.match, {
          [$["active"]]: pathname.includes("/match"),
        })}
      >
        <Icon size={24} name={"heart"} /> 매칭
      </Link>
      <Link
        href={"/friend"}
        className={classNames($.friend, {
          [$["active"]]: pathname.includes("/friend"),
        })}
      >
        <Icon size={24} name={"person"} /> 지인
      </Link>
      <Link
        href={"/my"}
        className={classNames($.my, {
          [$["active"]]: pathname.includes("/my"),
        })}
      >
        <Icon size={24} name={"my"} /> 마이
      </Link>
    </div>
  );
}

export default Footer;
