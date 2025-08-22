"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OptionalsValue } from "@/app/profile/form/components/AdditionalInfo";

export type ProfileForm = {
  name: string; gender: "MALE" | "FEMALE";
  year: string; month: string; day: string;
  height: string;
  residenceSido: string; residenceGugun: string;
  activeAreaSido: string; activeAreaGugun: string;
  job: string;
  optionals: OptionalsValue;
};

export type Contact = { type: "phone"|"kakao"|"insta"; value: string };

type Store = {
  profile?: ProfileForm;
  photos: string[];          // 업로드된 url들
  coverIndex?: number;
  contact?: Contact;
  markDone: (step: number) => void;
  done: Record<number, boolean>;
  setProfile: (p: ProfileForm) => void;
  setPhotos: (urls: string[]) => void;
  setCoverIndex: (i: number) => void;
  setContact: (c: Contact) => void;
  reset: () => void;
};

export const useProfileFlow = create<Store>()(
  persist(
    (set) => ({
      profile: undefined,
      photos: [],
      coverIndex: undefined,
      contact: undefined,
      done: {},
      markDone: (s) => set((st) => ({ done: { ...st.done, [s]: true } })),
      setProfile: (p) => set({ profile: p }),
      setPhotos: (urls) => set({ photos: urls }),
      setCoverIndex: (i) => set({ coverIndex: i }),
      setContact: (c) => set({ contact: c }),
      reset: () => set({ profile: undefined, photos: [], coverIndex: undefined, contact: undefined, done: {} }),
    }),
    { name: "profile-flow" }
  )
);
