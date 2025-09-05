"use client";

import { useState } from "react";

import Footer from "@/component/Footer";
import Header from "@/component/Header";
import {
  checkContactNumberApiV0ContactCheckGet,
  getContactListApiV0ContactGet,
  getContactListApiV0ContactPost,
} from "@/lib/orval/_generated/contact";
import { CreateContactRequest } from "@/lib/orval/_generated/iMFBackend.schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import $ from "./style.module.scss";

export default function Friend() {
  const [phone, setPhone] = useState("");
  const [modal, setModal] = useState<"none" | "exists" | "confirm">("none");

  const queryClient = useQueryClient();

  const { data: invitationList } = useQuery({
    queryKey: ["myInvitations"],
    queryFn: getContactListApiV0ContactGet,
  });

  const inviteMutation = useMutation({
    mutationFn: (params: CreateContactRequest) =>
      getContactListApiV0ContactPost(params),
    onSuccess: () => {
      alert("초대가 완료되었습니다");
      setModal("none");
      setPhone("");
      queryClient.invalidateQueries({ queryKey: ["myInvitations"] });
    },
    onError: (error) => {
      alert("초대에 실패했습니다. 다시 시도해주세요.");
      console.error("초대 실패:", error);
    },
  });

  const handleCheckPhone = async () => {
    const result = await checkContactNumberApiV0ContactCheckGet({
      phoneNumber: phone,
    });

    if (!result.data) {
      setModal("exists");
    } else {
      setModal("confirm");
    }
  };

  const handleInvite = () => {
    inviteMutation.mutate({ phoneNumber: phone });
  };

  return (
    <div className={$.friend}>
      <Header text="지인" />
      <div className={$.container}>
        <div className={$.inviteBox}>
          <label className={$.label}>지인 초대하기</label>
          <div className={$.inputRow}>
            <input
              type="tel"
              placeholder="휴대폰 번호(ex, 01000000000)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={$.phoneInput}
            />
            <button className={$.inviteBtn} onClick={handleCheckPhone}>
              초대
            </button>
          </div>
        </div>

        <div className={$.listBox}>
          <label className={$.label}>지인 목록</label>
          <ul className={$.list}>
            {invitationList?.data.map((item) => (
              <li key={item.phoneNumber} className={$.item}>
                <span
                  className={`${$.status} ${
                    item.status === "COMPLETED" ? $.received : $.invited
                  }`}
                >
                  {item.status === "COMPLETED" ? "수락" : "초대"}
                </span>
                <span className={$.phone}>
                  {item.phoneNumber.replace(
                    /(\d{3})(\d{4})(\d{4})/,
                    "$1-$2-$3",
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {modal === "exists" && (
        <div className={$.modal}>
          <div className={$.modalBox}>
            <div className={$.modalTitle}>알림</div>
            <div className={$.modalText}>
              {phone} 님은 이미 아는사이의 회원입니다.
            </div>
            <button className={$.modalConfirm} onClick={() => setModal("none")}>
              확인
            </button>
          </div>
        </div>
      )}
      {modal === "confirm" && (
        <div className={$.modal}>
          <div className={$.modalBox}>
            <div className={$.modalTitle}>초대하기</div>
            <div className={$.modalText}>
              {phone} 님에게 초대권을 발송합니다.
            </div>
            <div className={$.modalActions}>
              <button
                className={$.modalCancel}
                onClick={() => setModal("none")}
              >
                취소
              </button>
              <button className={$.modalConfirm} onClick={handleInvite}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
