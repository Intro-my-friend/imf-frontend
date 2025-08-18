"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import { withJwt } from "@/lib/authToken";
import type { ApiStatus } from "@/services/profile";
import { fetchMatchDetail, respondMatch } from "@/services/profile";
import Icon from "@/component/Icon";
import $ from "./style.module.scss";

type ButtonMode = "CONTACT_ONLY" | "LIKE_ONLY" | "LIKE_AND_REJECT" | "NONE";
const mapStatusToButtons = (s: ApiStatus): ButtonMode => {
  switch (s) {
    case "MATCH": return "CONTACT_ONLY";
    case "RECOMMEND": return "LIKE_ONLY";
    case "RECEIVED": return "LIKE_AND_REJECT";
    case "SENT": default: return "NONE";
  }
};

const toAge = (birthYYYYMMDD: string): number => {
  if (!/^[0-9]{8}$/.test(birthYYYYMMDD)) return NaN;
  const y = +birthYYYYMMDD.slice(0, 4);
  const m = +birthYYYYMMDD.slice(4, 6) - 1;
  const d = +birthYYYYMMDD.slice(6, 8);
  const now = new Date();
  let age = now.getFullYear() - y;
  if (now < new Date(now.getFullYear(), m, d)) age -= 1;
  return age;
};

const boolToSmoke = (b?: boolean) => (b ? "흡연" : "비흡연");

type Field = { label: string; value: string };

function interleaveWithRandomSlots<T>(
  images: string[],
  fields: T[]
): Array<{ kind: "field"; data: T } | { kind: "image"; src: string }> {
  const slots = images.length + 1;
  const bucket: Record<number, T[]> = {};
  fields.forEach((f) => {
    const pos = Math.floor(Math.random() * slots);
    bucket[pos] = bucket[pos] ? [...bucket[pos], f] : [f];
  });
  const out: Array<{ kind: "field"; data: T } | { kind: "image"; src: string }> = [];
  for (let i = 0; i < slots; i++) {
    (bucket[i] ?? []).forEach((x) => out.push({ kind: "field", data: x }));
    if (i < images.length) out.push({ kind: "image", src: images[i] });
  }
  return out;
}

type ModalType = "NONE" | "LIKE" | "REJECT" | "CONTACT" | "ERROR";

export default function MatchDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [modal, setModal] = useState<ModalType>("NONE");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["matchDetail", id],
    queryFn: withJwt((token) => fetchMatchDetail(id, token)),
    staleTime: 60_000,
  });

  const actMutation = useMutation({
    mutationFn: withJwt((token, params: { action: "LIKE" | "REJECT" }) =>
      respondMatch(id, params.action === "LIKE", token) // LIKE=true, REJECT=false
    ),
    onSuccess: () => {
      setModal("NONE");
      qc.invalidateQueries({ queryKey: ["matchDetail", id] });
    },
    onError: (error: any) => {
      const msg = error?.message || "요청에 실패했습니다.";
      setErrorMsg(msg);
      setModal("ERROR");
    },
  });

  const payload = data?.data;

  const age = useMemo(() => (payload ? toAge(payload.birth) : NaN), [payload]);

  const baseFields: Field[] = useMemo(() => {
    if (!payload) return [];
    return [
      { label: "나이", value: isNaN(age) ? "-" : `${payload.birth.slice(0, 4)}년생 (${age}세)` },
      { label: "키", value: `${Math.round(payload.height)}cm` },
      { label: "직업", value: payload.job || "-" },
      { label: "거주지", value: payload.residence || "-" },
      { label: "활동지", value: payload.activeArea || "-" },
    ];
  }, [payload, age]);

  const extraFields: Field[] = useMemo(() => {
    if (!payload) return [];
    const list: (Field | null)[] = [
      payload.hobby ? { label: "취미", value: payload.hobby } : null,
      payload.wanted ? { label: "이상형", value: payload.wanted } : null,
      payload.mbti ? { label: "MBTI", value: payload.mbti.toUpperCase() } : null,
      payload.personality ? { label: "성격", value: payload.personality } : null,
      payload.religion ? { label: "종교", value: payload.religion } : null,
      typeof payload.isSmoked === "boolean" ? { label: "흡연", value: boolToSmoke(payload.isSmoked) } : null,
      payload.drink ? { label: "음주", value: payload.drink } : null,
      payload.school ? { label: "학력", value: payload.school } : null,
      payload.company ? { label: "직장", value: payload.company } : null,
    ];
    // 사진 사이 랜덤 삽입에서 제외할 라벨
    const exclude = new Set(["거주지", "키"]);
    return list.filter(Boolean).filter((f) => !exclude.has((f as Field).label)) as Field[];
  }, [payload]);

  const images = useMemo(() => (payload?.imageList ?? []).slice(0, 5).filter(Boolean), [payload]);

  const [head, ...gallery] = images.length ? images : ["/img/placeholder.jpg"];
  const stream = useMemo(() => interleaveWithRandomSlots(gallery, extraFields), [gallery, extraFields]);

  const buttonMode: ButtonMode = payload ? mapStatusToButtons(payload.status) : "NONE";

  // 버튼 핸들러
  const onContact = () => setModal("CONTACT");
  const onLike = () => setModal("LIKE");
  const onReject = () => setModal("REJECT");

  if (isLoading) {
    return (
      <div className={$.page}>
        <header className={$.localHeader}>
          <button className={$.backBtn} onClick={() => (history.length > 1 ? router.back() : router.push("/match"))}>
            <Icon size={24} name={"left_arrow"} />
          </button>
          <div className={$.localTitle}>상세 프로필</div>
        </header>
        <div className={$.container}>
          <div className={`${$.topImage} ${$.skeleton}`} />
          <div className={`${$.name} ${$.skeleton}`} />
          <div className={$.baseList}>
            <div className={`${$.row} ${$.skeleton}`} />
            <div className={`${$.row} ${$.skeleton}`} />
            <div className={`${$.row} ${$.skeleton}`} />
          </div>
          <div className={`${$.galleryImage} ${$.skeleton}`} />
        </div>
      </div>
    );
  }

  if (isError || !payload) {
    return (
      <div className={$.page}>
        <header className={$.localHeader}>
          <button className={$.backBtn} onClick={() => (history.length > 1 ? router.back() : router.push("/match"))}>
            <Icon size={24} name={"left_arrow"} />
          </button>
          <div className={$.localTitle}>상세 프로필</div>
        </header>
        <div className={$.errorBox}>
          <div className={$.errorTitle}>프로필을 불러오지 못했어요</div>
          <div className={$.errorSub}>잠시 후 다시 시도해 주세요.</div>
          <button className={$.retryBtn} onClick={() => refetch()}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className={$.page}>
      {/* 로컬 헤더 */}
      <header className={$.localHeader}>
        <button
          className={$.backBtn}
          onClick={() => (history.length > 1 ? router.back() : router.push("/match"))}
        >
          <Icon size={24} name={"left_arrow"} />
        </button>
        <div className={$.localTitle}>상세 프로필</div>
      </header>

      {/* 본문 */}
      <div className={$.container}>
        {/* 상단 대표 이미지 */}
        <div className={$.topImage}>
          <img src={head} alt={`${payload.name} 메인`} />
        </div>

        {/* 이름 + 기본정보 */}
        <div className={$.name}>{payload.name}</div>
        <dl className={$.baseList}>
          {baseFields.map((f) => (
            <div key={f.label} className={$.row}>
              <dt className={$.label}>{f.label}</dt>
              <dd className={$.value}>{f.value}</dd>
            </div>
          ))}
        </dl>

        {/* 사진/필드 랜덤 스트림 */}
        <div className={$.stream}>
          {stream.map((item, idx) =>
            item.kind === "image" ? (
              <div key={`img-${idx}`} className={$.galleryImage}>
                <img src={item.src} alt={`사진 ${idx + 2}`} />
              </div>
            ) : (
              <div key={`field-${idx}`} className={$.row}>
                  <dt className={$.label}>{(item.data as Field).label}</dt>
                  <dd className={$.value}>{(item.data as Field).value}</dd>
              </div>
            )
          )}
        </div>

        {buttonMode !== "NONE" && (
          <section className={$.buttonSection} role="toolbar">
            {buttonMode === "CONTACT_ONLY" && (
              <button className={`${$.btn} ${$.btnPrimary}`} onClick={onContact}>
                연락처 보기
              </button>
            )}

            {buttonMode === "LIKE_ONLY" && (
              <button className={`${$.btn} ${$.btnPrimary}`} onClick={onLike}>
                호감 보내기
              </button>
            )}

            {buttonMode === "LIKE_AND_REJECT" && (
              <>
                <button className={`${$.btn} ${$.btnPrimary}`} onClick={onLike}>
                  호감 보내기
                </button>
                <button className={`${$.btn} ${$.btnGray}`} onClick={onReject}>
                  거절하기
                </button>
              </>
            )}
          </section>
        )}
      </div>

      {modal !== "NONE" && <div className={$.modalOverlay} onClick={() => setModal("NONE")} />}

      {modal === "LIKE" && (
        <div className={$.modal} role="dialog" aria-modal="true">
          <div className={$.modalBox}>
            <div className={$.modalTitle}>호감 보내기</div>
            <div className={$.modalText}>
              {payload?.name}님에게 호감을 보냅니다.
              <br />
              (4 coffee)
            </div>

            <div className={$.modalActions}>
              <button
                type="button"
                className={$.modalCancel}
                onClick={() => setModal("NONE")}
              >
                취소
              </button>
              <button
                className={$.modalConfirm}
                onClick={() => actMutation.mutate({ action: "LIKE" })}
                disabled={actMutation.isPending}
              >
                {actMutation.isPending ? "처리 중..." : "확인"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "REJECT" && (
        <div className={$.modal} role="dialog" aria-modal="true">
          <div className={$.modalBox}>
            <div className={$.modalTitle}>호감 거절</div>
            <div className={$.modalText}>
              {payload?.name}님의 호감을 거절합니다
              <br />
              이 작업은 되돌릴 수 없습니다
            </div>

            <div className={$.modalActions}>
              <button
                type="button"
                className={$.modalCancel}
                onClick={() => setModal("NONE")}
                disabled={actMutation.isPending}
              >
                취소
              </button>
              <button
                className={$.modalConfirm}
                onClick={() => actMutation.mutate({ action: "REJECT" })}
                disabled={actMutation.isPending}
              >
                {actMutation.isPending ? "처리 중..." : "확인"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "CONTACT" && (
        <div className={$.modal} role="dialog" aria-modal="true">
          <div className={$.modalBox}>
            <div className={$.modalTitle}>연락처 보기</div>

            <div className={$.contactRow}>
              <div className={$.contactBox}>
                <Icon name="phone" size={18} />
                <span>{payload?.contact ?? "-"}</span>
              </div>
            </div>

            <div className={$.modalActions}>
              <button
                type="button"
                className={$.modalCancel}
                onClick={() => setModal("NONE")}
              >
                닫기
              </button>
              <button
                className={$.modalConfirm}
                onClick={() => {
                  if (payload?.contact) {
                    navigator.clipboard?.writeText(payload.contact).catch(() => {});
                  }
                  setModal("NONE");
                }}
              >
                복사
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "ERROR" && (
        <div className={$.modal} role="dialog" aria-modal="true">
          <div className={$.modalBox}>
            <div className={$.modalTitle}>알림</div>
            <div className={$.modalText}>{errorMsg}</div>

            <div className={$.modalActions}>
              <button
                className={$.modalConfirm}
                onClick={() => setModal("NONE")}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}