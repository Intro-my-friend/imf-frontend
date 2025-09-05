"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { withJwt } from "@/lib/authToken";
import {
  getUserImages,
  setUserMainImage,
  type UserImagesCache,
  type UserImage,
} from "@/services/users";
import $ from "./style.module.scss";

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  nextHrefOnCreate: string;  // 예: "/profile/contact"
  backHrefOnEdit?: string;   // 예: "/my", 없으면 router.back()
};

function parseErr(e: any) {
  const msg = e?.message ?? "";
  try {
    const j = typeof msg === "string" ? JSON.parse(msg) : null;
    return j?.detail || j?.message || msg || "요청에 실패했습니다.";
  } catch { return msg || "요청에 실패했습니다."; }
}

export default function CoverStep({
  mode,
  nextHrefOnCreate,
  backHrefOnEdit,
}: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery<UserImagesCache>({
    queryKey: ["userImages"],
    queryFn: withJwt((token) => getUserImages(token)),
    staleTime: 20_000,
  });

  const list: UserImage[] = data?.data ?? [];
  const initialId = useMemo(
    () => list.find((x) => x.isThumbnail)?.imageId ?? list[0]?.imageId,
    [list]
  );
  const [selectedId, setSelectedId] = useState<number | undefined>(initialId);

  const saveMut = useMutation<
    { code: number; message: string },
    Error,
    { imageId: number },
    { prev?: UserImagesCache }
  >({
    mutationFn: withJwt((token, v) => setUserMainImage(v.imageId, token)),

    // ✅ 옵티미스틱 업데이트
    onMutate: async ({ imageId }) => {
      await qc.cancelQueries({ queryKey: ["userImages"] });
      const prev = qc.getQueryData<UserImagesCache>(["userImages"]);
      if (prev) {
        const next: UserImagesCache = {
          ...prev,
          data: prev.data.map((it) =>
            it.imageId === imageId
              ? { ...it, isThumbnail: true }
              : { ...it, isThumbnail: false }
          ),
        };
        qc.setQueryData(["userImages"], next);
      }
      return { prev };
    },
    onError: (e, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["userImages"], ctx.prev); // 롤백
      alert(parseErr(e));
    },
    onSuccess: async () => {
      // 서버 상태 동기화
      await qc.invalidateQueries({ queryKey: ["userImages"] });
      if (mode === "create") router.push(nextHrefOnCreate);
      else backHrefOnEdit ? router.push(backHrefOnEdit) : router.back();
    },
  });

  const onSave = () => {
    if (!selectedId) {
      alert("대표 사진을 선택해 주세요.");
      return;
    }
    saveMut.mutate({ imageId: selectedId }); // ← 변수 전달
  };

  return (
    <div className={$.cover}>
      <div className={$.header}>
        <h1 className={$.title}>대표 사진 선택</h1>
      </div>

      {isLoading ? (
        <div className={$.placeholder}>불러오는 중…</div>
      ) : isError ? (
        <div className={$.placeholder}>
          불러오지 못했어요.{" "}
          <button className={$.link} onClick={() => refetch()}>다시 시도</button>
        </div>
      ) : list.length === 0 ? (
        <div className={$.placeholder}>등록된 사진이 없어요.</div>
      ) : (
        <div className={$.grid}>
          {list.map((it) => (
            <button
              key={it.imageId}
              type="button"
              className={`${$.card} ${selectedId === it.imageId ? $.active : ""}`}
              onClick={() => setSelectedId(it.imageId)}
            >
              <img src={it.url} alt="사진" />
              {selectedId === it.imageId && <div className={$.badge}>선택</div>}
            </button>
          ))}
        </div>
      )}

      <div className={$.footer}>
        <button
          className={$.nextBtn}
          onClick={onSave}
          disabled={!selectedId || saveMut.isPending}
          aria-disabled={!selectedId || saveMut.isPending}
        >
          {saveMut.isPending ? "저장 중…" : mode === "edit" ? "저장" : "다음으로"}
        </button>
      </div>
    </div>
  );
}
