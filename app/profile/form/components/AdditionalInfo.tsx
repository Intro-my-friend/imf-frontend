"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Stack,
  Button,
  Paper,
  Typography,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

export type OptionalKey =
  | "hobby"
  | "wanted"
  | "mbti"
  | "personality"
  | "religion"
  | "isSmoked"
  | "drink"
  | "school"
  | "company";

export type OptionalsValue = Partial<Record<OptionalKey, string | boolean>>;

const OPTIONAL_LABEL: Record<OptionalKey, string> = {
  hobby: "취미",
  wanted: "이상형",
  mbti: "MBTI",
  personality: "성격",
  religion: "종교",
  isSmoked: "흡연",
  drink: "음주",
  school: "학력",
  company: "직장",
};

const ALL_KEYS = Object.keys(OPTIONAL_LABEL) as OptionalKey[];

const formatValue = (k: OptionalKey, v: string | boolean) =>
  k === "isSmoked" ? (v ? "흡연" : "비흡연") :
  k === "mbti" && typeof v === "string" ? v.toUpperCase() : String(v);

type Props = {
  /** 현재 값: { key: value } */
  value: OptionalsValue;
  /** 값 변경 콜백 */
  onChange: (next: OptionalsValue) => void;
  /** 섹션 외부에서 주는 className (선택) */
  className?: string;
  /** 전체 비활성화 (선택) */
  disabled?: boolean;
};

export default function AdditionalInfo({
  value,
  onChange,
  className,
  disabled,
}: Props) {
  // 아직 추가되지 않은 키
  const remainingKeys = useMemo(
    () => ALL_KEYS.filter((k) => !(k in value)),
    [value]
  );

  // Adder UI 상태
  const [adderOpen, setAdderOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<OptionalKey | "">("");
  const [textValue, setTextValue] = useState("");
  const [smokeValue, setSmokeValue] = useState(false);

  const openAdder = () => {
    if (disabled) return;
    if (!adderOpen) {
      setSelectedKey((remainingKeys[0] as OptionalKey) ?? "");
      setTextValue("");
      setSmokeValue(false);
      setAdderOpen(true);
    }
  };

  const cancelAdder = () => {
    setAdderOpen(false);
    setSelectedKey("");
    setTextValue("");
  };

  const add = () => {
    if (!selectedKey) return;

    const raw =
      selectedKey === "isSmoked"
        ? smokeValue
        : selectedKey === "mbti"
        ? textValue.trim().toUpperCase()
        : textValue.trim();

    const next: OptionalsValue = { ...value, [selectedKey]: raw };
    onChange(next);
    cancelAdder();
  };

  const remove = (k: OptionalKey) => {
    const next = { ...value };
    delete next[k];
    onChange(next);
  };

  const addDisabled =
    disabled ||
    !selectedKey ||
    (selectedKey !== "isSmoked" && textValue.trim().length === 0);

  return (
    <Box className={className}>
      {/* 헤더 */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Typography fontWeight={600} color="#2e2f33">
          추가 정보 (선택)
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={openAdder}
          disabled={disabled || adderOpen || remainingKeys.length === 0}
          sx={{
            borderRadius: 2,
            bgcolor: "#ff9877",
            "&:disabled": { opacity: 0.5 },
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          + 항목 추가
        </Button>
      </Stack>

      {/* 추가된 항목 리스트 */}
      <Stack spacing={1.5} mb={2.5}>
        {Object.entries(value).length === 0 ? (
          <Typography variant="body2" color="#9aa0a6">
            원하는 항목을 추가해 보세요.
          </Typography>
        ) : (
          Object.entries(value).map(([k, v]) => {
            const key = k as OptionalKey;
            return (
              <Paper
                key={key}
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minHeight: 48,
                }}
              >
                <Stack direction="row" spacing={1}>
                  <Typography fontWeight={600} color="#2e2f33">
                    {OPTIONAL_LABEL[key]}
                  </Typography>
                  <Typography color="#70737c">{formatValue(key, v!)}</Typography>
                </Stack>
                <Button
                  variant="text"
                  size="small"
                  onClick={() => remove(key)}
                  disabled={disabled}
                  sx={{
                    minWidth: "auto",
                    px: 1.25,
                    color: "#ff6b6b",
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  삭제
                </Button>
              </Paper>
            );
          })
        )}
      </Stack>

      {/* Adder 폼 */}
      {adderOpen && (
        <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                value={selectedKey}
                onChange={(e) => {
                  const next = e.target.value as OptionalKey;
                  setSelectedKey(next);
                  setTextValue("");
                  setSmokeValue(false);
                }}
                displayEmpty
                disabled={disabled}
              >
                {remainingKeys.map((k) => (
                  <MenuItem key={k} value={k}>
                    {OPTIONAL_LABEL[k]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedKey === "isSmoked" ? (
              <ToggleButtonGroup
                value={smokeValue ? "Y" : "N"}
                exclusive
                onChange={(_, val) => {
                  if (val === "Y") setSmokeValue(true);
                  if (val === "N") setSmokeValue(false);
                }}
                sx={{ height: 40 }}
              >
                <ToggleButton value="Y">흡연</ToggleButton>
                <ToggleButton value="N">비흡연</ToggleButton>
              </ToggleButtonGroup>
            ) : (
              <TextField
                size="small"
                fullWidth
                placeholder={
                  selectedKey ? `${OPTIONAL_LABEL[selectedKey]}을(를) 입력하세요` : "항목을 먼저 선택하세요"
                }
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                inputProps={{ maxLength: selectedKey === "mbti" ? 4 : 50 }}
                disabled={disabled}
              />
            )}
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="flex-end" mt={1.25}>
            <Button variant="text" onClick={cancelAdder} disabled={disabled}>
              취소
            </Button>
            <Button
              variant="contained"
              onClick={add}
              disabled={addDisabled}
              sx={{ bgcolor: "#ff6b6b", "&:disabled": { opacity: 0.5 } }}
            >
              추가
            </Button>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
