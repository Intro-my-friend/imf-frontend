"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { withJwt } from "@/lib/authToken";
import {
  getUserImages,
  uploadUserImage,
  deleteUserImage,
  type UserImagesCache,
  type UserImage,
} from "@/services/users";
import $ from "./style.module.scss";

type Mode = "create" | "edit";

type Props = {
  mode: Mode;
  nextHrefOnCreate: string;
  doneHrefOnEdit?: string;
  max?: number;
};

const MAX_DEFAULT = 5;

function parseErr(e: any) {
  const msg = e?.message ?? "";
  try {
    const j = typeof msg === "string" ? JSON.parse(msg) : null;
    return j?.detail || j?.message || msg || "요청에 실패했습니다.";
  } catch { return msg || "요청에 실패했습니다."; }
}

export default function PhotosStep({
  mode,
  nextHrefOnCreate,
  doneHrefOnEdit,
  max = MAX_DEFAULT,
}: Props) {
  const router = useRouter();
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery<UserImagesCache>({
    queryKey: ["userImages"],
    queryFn: withJwt((token) => getUserImages(token)),
    staleTime: 30_000,
  });

  const list: UserImage[] = data?.data ?? [];
  const isFull = list.length >= max;

  const uploadMut = useMutation<UserImage, Error, File>({
    mutationFn: withJwt((token, file) => uploadUserImage(file, token)),
    onSuccess: (newItem) => {
      qc.setQueryData<UserImagesCache>(["userImages"], (old) =>
        old ? { ...old, data: [...old.data, newItem] }
            : { code: 200, message: "ok", data: [newItem] }
      );
    },
    onError: (e) => alert(parseErr(e)),
  });

  const delMut = useMutation({
    mutationFn: withJwt((token, vars: { imageId: number | string }) =>
      deleteUserImage(vars.imageId, token)
    ),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userImages"] }),
    onError: (e) => alert(parseErr(e)),
  });

  const onPick = () => inputRef.current?.click();

  const onFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remain = Math.max(0, max - list.length);
    const toUpload = files.slice(0, remain);

    if (toUpload.length === 0) {
      alert(`최대 ${max}장까지 업로드할 수 있어요.`);
      e.target.value = "";
      return;
    }
    try {
      setUploading(true);
      for (const f of toUpload) await uploadMut.mutateAsync(f);
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

  // 카드 구성: 항상 '추가' 카드는 맨 뒤
  const renderItems = useMemo(() => {
    if (isLoading || isError) return [];
    const imgs = list.map((it) => ({ kind: "img" as const, it }));
    return isFull ? imgs : [...imgs, { kind: "add" as const }];
  }, [isLoading, isError, list, isFull]);

  const canProceed = list.length > 0 && !uploading && !uploadMut.isPending;

  const onPrimary = () => {
      router.push(nextHrefOnCreate);
  };

  return (
    <div className={$.photos}>
      <div className={$.header}>
        <h1 className={$.title}>사진 추가</h1>
        <p className={$.sub}>최대 {max}장 · {list.length}/{max}</p>
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
          onClick={onPrimary}
          disabled={!canProceed}
          aria-disabled={!canProceed}
        >
          다음으로
        </button>
      </div>
    </div>
  );
}
