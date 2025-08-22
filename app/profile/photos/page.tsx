"use client";

import { useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { withJwt } from "@/lib/authToken";
import {
  getUserImages,
  uploadUserImage,
  deleteUserImage,
  type UserImagesCache,
  type UserImage,          // ✅ 도메인 타입 사용
} from "@/services/users";

import $ from "./style.module.scss";

const MAX_IMAGES = 5;

function parseErr(e: any) {
  const msg = e?.message ?? "";
  try {
    const j = typeof msg === "string" ? JSON.parse(msg) : null;
    return j?.detail || j?.message || msg || "요청에 실패했습니다.";
  } catch {
    return msg || "요청에 실패했습니다.";
  }
}

export default function PhotosPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  // ✅ 캐시 타입을 명시해서 unknown 문제 방지
  const { data, isLoading, isError, refetch } = useQuery<UserImagesCache>({
    queryKey: ["userImages"] as const,
    queryFn: withJwt((token) => getUserImages(token)),
    staleTime: 30_000,
  });

  // ✅ 리스트 타입도 UserImage로 통일
  const list: UserImage[] = data?.data ?? [];
  const isFull = list.length >= MAX_IMAGES;

  // ✅ 업로드 결과 타입도 UserImage
  const uploadMut = useMutation<UserImage, Error, File>({
    mutationFn: withJwt((token, file) => uploadUserImage(file, token)),
    onSuccess: (newItem) => {
      // ✅ 캐시 타입을 동일하게 지정
      qc.setQueryData<UserImagesCache>(["userImages"], (old) => {
        if (!old) return { code: 200, message: "ok", data: [newItem] };
        return { ...old, data: [...old.data, newItem] };
      });
    },
    onError: (e) => alert(parseErr(e)),
  });

  const delMut = useMutation({
    mutationFn: withJwt((token, vars: { imageId: number | string }) =>
      deleteUserImage(vars.imageId, token)
    ),
    onError: (e) => alert(parseErr(e)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userImages"] }),
  });

  const onPick = () => inputRef.current?.click();

  const onFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remain = Math.max(0, MAX_IMAGES - list.length);
    const toUpload = files.slice(0, remain);

    if (toUpload.length === 0) {
      alert(`최대 ${MAX_IMAGES}장까지 업로드할 수 있어요.`);
      e.target.value = "";
      return;
    }
    try {
      setUploading(true);
      for (const f of toUpload) {
        await uploadMut.mutateAsync(f);
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const onDelete = (imageId: number | string) => {
    if (delMut.isPending) return;
    if (!confirm("이 사진을 삭제할까요?")) return;
    delMut.mutate({ imageId });
  };

  // ✅ 추가 카드는 항상 **맨 뒤**
  const renderItems = useMemo(() => {
    if (isLoading || isError) return [];
    const imgs = list.map((it) => ({ kind: "img" as const, it }));
    return isFull ? imgs : [...imgs, { kind: "add" as const }];
  }, [list, isFull, isLoading, isError]);

  const canNext = list.length > 0 && !uploading && !uploadMut.isPending;

  return (
    <div className={$.photos}>
      <div className={$.header}>
        <h1 className={$.title}>사진 추가</h1>
        <p className={$.sub}>최대 {MAX_IMAGES}장 · {list.length}/{MAX_IMAGES}</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={onFilesSelected}
      />

      {isLoading ? (
        <div className={$.placeholder}>이미지를 불러오는 중…</div>
      ) : isError ? (
        <div className={$.placeholder}>
          불러오지 못했어요.{" "}
          <button className={$.link} onClick={() => refetch()}>
            다시 시도
          </button>
        </div>
      ) : (
        <>
          {list.length === 0 ? (
            <div className={$.grid}>
              <button
                type="button"
                className={$.addCard}
                onClick={onPick}
                disabled={isFull || uploading}
              >
                <span className={$.plus}>＋</span>
                <span>사진 추가하기</span>
              </button>
              <div className={$.ghostCard} aria-hidden />
            </div>
          ) : (
            <div className={$.grid}>
              {renderItems.map((node, idx) =>
                node.kind === "add" ? (
                  <button
                    key={`add-${idx}`}
                    type="button"
                    className={$.addCard}
                    onClick={onPick}
                    disabled={isFull || uploading}
                  >
                    <span className={$.plus}>＋</span>
                    <span>사진 추가하기</span>
                  </button>
                ) : (
                  <div className={$.card} key={String(node.it.imageId)}>
                    <img src={node.it.url} alt="업로드된 사진" loading="lazy" />
                    <button
                      className={$.delBtn}
                      onClick={() => onDelete(node.it.imageId)}
                      disabled={delMut.isPending}
                      aria-label="사진 삭제"
                    >
                      삭제
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </>
      )}

      <div className={$.footer}>
        <button
          className={$.nextBtn}
          onClick={() => router.push("/profile/photos/cover")}
          disabled={!canNext}
          aria-disabled={!canNext}
        >
          다음으로
        </button>
      </div>
    </div>
  );
}
