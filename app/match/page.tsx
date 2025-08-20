"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { withJwt } from "@/lib/authToken";

import Footer from "@/component/Footer";
import Header from "@/component/Header";
import Link from "next/link";

import { fetchUserInfo } from "@/services/my";
import { fetchMatchList } from "@/services/match";         // /match?type=MATCH|RECEIVED|SENT
import type { MatchListItem, UserInfo, MatchListRes } from "@/services/match";
import $ from "./style.module.scss";

/** ----- 탭 타입/라벨 ----- */
type MatchType = "MATCH" | "RECEIVED" | "SENT";
const TABS: MatchType[] = ["MATCH", "RECEIVED", "SENT"];
const TAB_LABEL: Record<MatchType, string> = {
  MATCH: "매칭",
  RECEIVED: "받은 호감",
  SENT: "보낸 호감",
};

/** ----- 유틸 ----- */
const toAge = (birth?: string) => {
  if (!birth || !/^\d{8}$/.test(birth)) return undefined;
  const y = +birth.slice(0, 4), m = +birth.slice(4, 6) - 1, d = +birth.slice(6, 8);
  const now = new Date();
  let age = now.getFullYear() - y;
  if (now < new Date(now.getFullYear(), m, d)) age -= 1;
  return age;
};

function ddayFromCreatedAt(createdAt: string): number | null {
  const createdMs  = new Date(createdAt).getTime();
  if (Number.isNaN(createdMs)) return null;
  const deadlineMs = createdMs + 48 * 3600 * 1000;           // 정확히 48시간
  const leftMs     = deadlineMs - Date.now();
  if (leftMs <= 0) return null;
  return Math.ceil(leftMs / (24 * 3600 * 1000));             // 0<left<=24h → 1, 24h<left<=48h → 2
}

function useCountdownToNext8AM() {
  const pad = (n: number) => String(n).padStart(2, "0");
  const [text, setText] = useState(() => calc());
  function calc() {
    const now = new Date();
    const t = new Date(now);
    t.setHours(8, 0, 0, 0);
    if (now >= t) t.setDate(t.getDate() + 1);
    const ms = t.getTime() - now.getTime();
    const h = Math.floor(ms / 3_600_000);
    const m = Math.floor((ms % 3_600_000) / 60_000);
    const s = Math.floor((ms % 60_000) / 1000);
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  useEffect(() => {
    const id = setInterval(() => setText(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return text;
}

type ModalType = "NONE" | "NEED_PROFILE";

export default function MatchHomePage() {
  const router = useRouter();
  const [tab, setTab] = useState<MatchType>("MATCH");
  const [modal, setModal] = useState<ModalType>("NONE");

  // 1) 사용자 정보 (displayList / isProfile 판단)
  const { data: userInfo } = useQuery({
    queryKey: ["userInfo"],
    queryFn: withJwt((token) => fetchUserInfo(token)),
    staleTime: 60_000,
  });
  const me: UserInfo | undefined = (userInfo as any)?.data;

  const isIntroducerMode = me?.displayList === false; // 주선자 모드
  const hasProfile = me?.isProfile === true;          // 프로필 여부

  // 2) 최근 활동 리스트 (탭 타입으로 호출) — introducer 모드면 요청 안 함
  const { data: listRes, isFetching, isPending } = useQuery<MatchListRes>({
    queryKey: ["recentActivity", tab],
    queryFn: withJwt((token) => fetchMatchList(token, tab)),
    enabled: !isIntroducerMode,
    placeholderData: keepPreviousData,   // ✅ v5 방식
    staleTime: 0,
  });
  const items: MatchListItem[] = (listRes as any)?.data ?? [];

  const countdown = useCountdownToNext8AM();

  const onClickCTA = () => {
    if (isIntroducerMode) return;           // 주선자 모드에서는 동작 없음
    if (!hasProfile) setModal("NEED_PROFILE");
    else router.push("/match/recommend");
  };

  /** 주선자 모드 화면 */
  if (isIntroducerMode) {
    return (
      <div className={$.page}>
        <Header text={"내친소"} />
        <main className={`${$.main} ${$.centered}`}>
          <div className={$.pill}>주선자 모드</div>
          <p className={$.muted}>해당 모드에서는 매칭을 받을 수 없어요.</p>
          <div className={$.noticeBox} role="note">
            <div className={$.noticeTitle}>안내사항</div>
            <div className={$.noticeDesc}>언제든지 마이페이지에서 모드를 변경할 수 있습니다</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /** 기본 화면 */
  return (
    <div className={$.page}>
      <Header text={"내친소"} />
      <main className={$.main}>
        {/* 타이머 (가운데) */}
        <div className={$.timerWrap}>
          <div className={$.timerIcon} aria-hidden />
          <span className={$.timerText}>{countdown}</span>
        </div>

        {/* CTA */}
        <button className={$.ctaButton} onClick={onClickCTA}>
          매칭 보러가기
        </button>

        <hr className={$.divider} />

        {/* 최근 활동 */}
        <section className={$.section} aria-labelledby="recent-title">
          <h2 id="recent-title" className={$.sectionTitle}>최근 활동</h2>

          <div role="tablist" className={$.tabs} aria-label="최근 활동 종류">
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                className={`${$.tab} ${tab === t ? $.tabActive : ""}`}
                onClick={() => setTab(t)}
              >
                {TAB_LABEL[t]}
              </button>
            ))}
          </div>

          <div className={$.grid} aria-busy={isFetching || isPending}>
            {isPending ? (
              <div className={$.empty}>불러오는 중…</div>
            ) : items.length === 0 ? (
              <div className={$.empty}>새로운 인연을 만나보세요!</div>
            ) : (
              items.map((m) => {
                const age = toAge(m.user.birth);
                const dday = ddayFromCreatedAt(m.createdAt); // ⬅️ 추가

                const isMatch = tab === "MATCH";
                const showBadge = !isMatch && dday !== null;

                return (
                  <Link
                    key={m.matchId}
                    href={`/match/${m.matchId}`}
                    className={$.card}
                    prefetch={false}
                  >
                    {m.user.profileImage ? (
                      <img className={$.cardImg} src={m.user.profileImage} alt="" />
                    ) : (
                      <div className={`${$.cardImg} ${$.noImg}`} />
                    )}

                    {showBadge && <div className={$.badge}>D-{dday}</div>}

                    <div className={$.cardMeta}>
                      <span className={$.age}>{age ? `${age}세` : "-"}</span>
                      <span className={$.dot}>·</span>
                      <span className={$.job}>{m.user.job ?? "-"}</span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* 프로필 필요 모달 */}
      {modal !== "NONE" && <div className={$.modalOverlay} onClick={() => setModal("NONE")} />}
      {modal === "NEED_PROFILE" && (
        <div className={$.modal} role="dialog" aria-modal="true">
          <div className={$.modalBox}>
            <div className={$.modalTitle}>매칭 보러가기</div>
            <div className={$.modalText}>매칭을 위해서는 소개글을 작성해야 합니다</div>
            <div className={$.modalActions}>
              <button className={$.modalCancel} onClick={() => setModal("NONE")}>다음에</button>
              <button className={$.modalConfirm} onClick={() => router.push("/profile/edit")}>
                프로필 작성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}