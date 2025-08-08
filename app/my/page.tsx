"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image, { StaticImageData } from "next/image";

import { withJwt } from "@/lib/authToken";
import { fetchUserInfo, patchPurpose, getUserImages } from "@/services/my";

import Header from "@/component/Header";
import Footer from "@/component/Footer";
import Icon from "@/component/Icon";

import defaultProfileImage from "@/component/assets/default-profile.png";

import $ from "./style.module.scss";

type Mode = "introduce" | "recommend";

export default function My() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<Mode>("introduce");
  const [modeModal, setModelModal] = useState<Mode | "none">("none");
  const [isProfileModal, setIsProfileModal] = useState(false);

  const useUserInfoQuery = useQuery({
    queryKey: ["userInfo"],
    queryFn: withJwt((token) => fetchUserInfo(token)),
    staleTime: 1000 * 60,
  });

  const { data: profileUrl } = useQuery({
    queryKey: ["profileImage"],
    queryFn: withJwt((token) => getUserImages(token)),
    select: (res: any) => {
      const thumb = res?.data?.find((img: any) => img.isThumbnail);
      return thumb?.profileImgUrl ?? null;
    },
    staleTime: 60_000,
  });

  const handleTabClick = (mode: Mode) => {
    if (selectedTab === mode || mutatePurpose.isPending) return;
    setModelModal(mode);
  };

  useEffect(() => {
    if (useUserInfoQuery.isSuccess) {
      const data = useUserInfoQuery.data.data
      const isVerified = data.isVerified;
      if (!isVerified) {
        alert("인증 안된 유저!");
        //router.push("/register/verify"); // 리다이렉트 경로 입력
      }
      setSelectedTab(data.displayList ? "introduce" : "recommend");
    }
  }, [useUserInfoQuery.data, useUserInfoQuery.isSuccess, router]);

  const mutatePurpose = useMutation({
    mutationFn: withJwt((token, params: { mode: Mode }) => patchPurpose(params.mode === "introduce", token)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      setModelModal("none");
    },
    onError: () => {
      alert("변경에 실패했습니다. 잠시 후 다시 시도해주세요.");
    },
  });

  const handleConfirm = () => {
    if (modeModal === "none") return;
    mutatePurpose.mutate({ mode: modeModal });
  };

  if (useUserInfoQuery.isLoading) return null;

  return (
    <div className={$.my}>
      <Header text={"마이페이지"} />

      <div className={$.section}>
        <div className={$.tabContainer}>
        <button
          className={`${$.tabButton} ${selectedTab === "introduce" ? $.active : ""}`}
          onClick={() => handleTabClick("introduce")}
          aria-pressed={selectedTab === "introduce"}
          disabled={mutatePurpose.isPending}
        >
          소개도 받기
        </button>
        <button
          className={`${$.tabButton} ${selectedTab === "recommend" ? $.active : ""}`}
          onClick={() => handleTabClick("recommend")}
          aria-pressed={selectedTab === "recommend"}
          disabled={mutatePurpose.isPending}
        >
          주선만 하기
        </button>
        </div>

        <div className={$.profileWrapper}>
          <div
            className={$.profileImageBox}
            onClick={() => setIsProfileModal(true)}
          >
            <Image
              src={profileUrl ?? defaultProfileImage}
              alt="Profile"
              width={140}
              height={140}
              className={$.profileImage}
              style={{ objectFit: "cover" }}
              onError={(e) => {
                // 외부 URL 깨지면 기본 이미지로 교체
                (e.currentTarget as HTMLImageElement).src = defaultProfileImage.src;
              }}
              priority
            />
            <button className={$.editButton}>
              <Icon size={24} name={"pencil"} />
            </button>
          </div>
        </div>

        <div className={$.adBanner}>광고자리</div>

        <ul className={$.menuList}>
          <li className={$.menuItem}>
            <div className={$.left}>
              <Icon size={24} name={"request"} />
              <span className={$.label}>문의하기</span>
            </div>
            <span className={$.arrow}>›</span>
          </li>
          <li className={$.menuItem}>
            <div className={$.left}>
              <Icon size={24} name={"logout"} />
              <span className={$.label}>로그아웃</span>
            </div>
            <span className={$.arrow}>›</span>
          </li>
        </ul>
      </div>
      {modeModal !== "none" && (
        <div className={$.modal}>
          <div className={$.modalBox}>
            <div className={$.modalTitle}>
              {modeModal === "recommend" ? "주선만 하기" : "소개도 받기"}
            </div>
            <div className={$.modalText}>
              {modeModal === "recommend"
                ? "주선만 하기 모드로 전환시 매칭이 불가능하며, 받았던 호감이 있다면 거절됩니다."
                : "매칭을 통해 하루 3명 나의 운명을 찾아보세요!"}
            </div>
            <div className={$.modalActions}>
              <button
                className={$.modalCancel}
                onClick={() => setModelModal("none")}
                disabled={mutatePurpose.isPending}
              >
                취소
              </button>
              <button
                className={$.modalConfirm}
                onClick={handleConfirm}
                disabled={mutatePurpose.isPending}
              >
                {mutatePurpose.isPending ? "변경 중..." : "확인"}
              </button>
            </div>
          </div>
        </div>
      )}
      {isProfileModal && (
        <div className={$.modalOverlay} onClick={() => setIsProfileModal(false)}>
          <div className={$.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={$.modalButton}>사진 변경</button>
            <button className={$.modalButton}>프로필 변경</button>
            <button className={$.modalButton}>연락처 변경</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
