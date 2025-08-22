"use client";

import { useEffect, useMemo, useState } from "react";
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

function parseErr(e: any) {
  const msg = e?.message ?? "";
  try {
    const j = typeof msg === "string" ? JSON.parse(msg) : null;
    return j?.detail || j?.message || msg || "요청에 실패했습니다.";
  } catch {
    return msg || "요청에 실패했습니다.";
  }
}

export default function CoverPhotoPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery<UserImagesCache>({
    queryKey: ["userImages"] as const,
    queryFn: withJwt((token) => getUserImages(token)),
    staleTime: 30_000,
  });

  const images: UserImage[] = data?.data ?? [];

  // 현재 대표 이미지로 초기 선택
  const defaultSelected = useMemo(
    () => images.find((i) => i.isThumbnail)?.imageId,
    [images]
  );
  const [selectedId, setSelectedId] = useState<number | string | null>(null);

  useEffect(() => {
    if (defaultSelected != null) setSelectedId(defaultSelected);
  }, [defaultSelected]);

  const saveMut = useMutation<
    { code: number; message: string }, // TData
    Error,                              // TError
    number | string                     // TVariables (imageId)
  >({
    mutationFn: withJwt((token, imageId) => setUserMainImage(imageId, token)),
    onSuccess: (_res, imageId) => {
      // 선택한 이미지 기준으로 캐시 갱신(대표 1장)
      qc.setQueryData<UserImagesCache>(["userImages"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((it) =>
            it.imageId === imageId
              ? { ...it, isThumbnail: true, isMain: true }
              : { ...it, isThumbnail: false, isMain: false }
          ),
        };
      });
      router.push("/profile/contact"); // 다음 단계
    },
    onError: (e) => alert(parseErr(e)),
  });


  const onConfirm = () => {
    if (!selectedId) return;
    if (selectedId === defaultSelected) {
      router.push("/profile/contact");
      return;
    }
    saveMut.mutate(selectedId); 
  };

  return (
    <div className={$.cover}>
      <div className={$.header}>
        <h1 className={$.title}>대표 사진 선택</h1>
        <p className={$.sub}>첫 화면에 노출될 사진을 선택해 주세요.</p>
      </div>

      {isLoading ? (
        <div className={$.placeholder}>이미지를 불러오는 중…</div>
      ) : isError ? (
        <div className={$.placeholder}>
          불러오지 못했어요.{" "}
          <button className={$.link} onClick={() => refetch()}>
            다시 시도
          </button>
        </div>
      ) : images.length === 0 ? (
        <div className={$.placeholder}>등록된 사진이 없어요. 이전 단계에서 사진을 추가해 주세요.</div>
      ) : (
        <div className={$.grid}>
          {images.map((img) => {
            const active = selectedId === img.imageId;
            return (
              <button
                key={String(img.imageId)}
                type="button"
                className={`${$.card} ${active ? $.active : ""}`}
                onClick={() => setSelectedId(img.imageId)}
                aria-pressed={active}
              >
                <img src={img.url} alt="사진" />
                <div className={`${$.check} ${active ? $.on : ""}`} aria-hidden />
              </button>
            );
          })}
        </div>
      )}

      <div className={$.footer}>
        <button
          className={$.nextBtn}
          onClick={onConfirm}
          disabled={!selectedId || saveMut.isPending}
          aria-disabled={!selectedId || saveMut.isPending}
        >
          {saveMut.isPending ? "저장 중…" : "다음으로"}
        </button>
      </div>
    </div>
  );
}
