"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Icon from "@/component/Icon";
import { withJwt } from "@/lib/authToken";
import { fetchMatchList, type MatchListItem } from "@/services/profile";
import $ from "./style.module.scss";

const toAge = (birth?: string) => {
  if (!birth || !/^\d{8}$/.test(birth)) return undefined;
  const y = +birth.slice(0, 4);
  const m = +birth.slice(4, 6) - 1;
  const d = +birth.slice(6, 8);
  const now = new Date();
  let age = now.getFullYear() - y;
  if (now < new Date(now.getFullYear(), m, d)) age -= 1;
  return age;
};

export default function MatchListPage() {
  const router = useRouter();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["matchList"],
    queryFn: withJwt((token) => fetchMatchList(token)),
    staleTime: 60_000,
  });

  const list: MatchListItem[] = useMemo(() => data?.data ?? [], [data]);
  console.log(list);
  const isEmpty = list.length === 0;

  return (
    <div className={$.page}>
        <header className={$.localHeader}>
          <button className={$.backBtn} onClick={() => (router.push("/match"))}>
            <Icon size={24} name={"left_arrow"} />
          </button>
          <div className={$.localTitle}>매칭 보러가기</div>
        </header>

      <div className={$.container}>
        {/* 상단 "오늘의 매칭" 카드 */}
        <section
          className={`${$.tipBox} ${isEmpty && !isLoading && !isError ? $.tipBoxHero : ""}`}
          aria-live="polite"
        >
          <div className={$.tipTitle}>오늘의 매칭</div>
          <div className={$.tipSub}>
            {isEmpty ? "아쉽게도 오늘은 새로운 인연이 없어요." : "하루 3명까지 추천드려요"}
          </div>
        </section>

        {/* 로딩 스켈레톤 */}
        {isLoading && (
          <ul className={$.list}>
            <li className={`${$.card} ${$.skeleton}`} />
            <li className={`${$.card} ${$.skeleton}`} />
            <li className={`${$.card} ${$.skeleton}`} />
          </ul>
        )}

        {/* 에러 */}
        {isError && (
          <div className={$.errorBox}>
            <div className={$.errorTitle}>목록을 불러오지 못했어요</div>
            <div className={$.errorSub}>네트워크 상태를 확인 후 다시 시도해 주세요.</div>
            <button className={$.retryBtn} onClick={() => refetch()}>다시 시도</button>
          </div>
        )}

        {/* 리스트 */}
        {!isLoading && !isError && (
          <ul className={$.list}>
            {list.map((item) => {
              const age = toAge(item.user.birth);
              const subtitle =
                age !== undefined
                  ? `${age}세${item.user.job ? `, ${item.user.job}` : ""}`
                  : item.user.job || "-";

              return (
                <li key={item.matchId}>
                  <button
                    className={$.card}
                    onClick={() => router.push(`/match/${item.matchId}`)}
                    aria-label={`${subtitle} 프로필 보기`}
                  >
                    <div className={$.thumb}>
                      <img src={item.user.profileImage} alt="" />
                      <div className={$.grad} />
                      <div className={$.caption}>{subtitle}</div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
