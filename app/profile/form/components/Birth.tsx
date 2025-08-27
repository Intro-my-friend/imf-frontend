import { ProfileInputType } from "@/app/profile/form/ProfileForm";
import { DefaultProps } from "@/type/props";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

type Props = {
  profileInput: ProfileInputType;
  setProfileInput: React.Dispatch<React.SetStateAction<ProfileInputType>>;
} & DefaultProps;

function Birth({ profileInput, setProfileInput, className }: Props) {
  const thisYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 55 }, (_, i) =>
    String(thisYear - i),
  );
  const monthOptions = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  function getDaysInMonth(year: string, month: string) {
    if (!year || !month) return 31;
    return new Date(Number(year), Number(month), 0).getDate();
  }

  const daysInMonth = getDaysInMonth(profileInput.year, profileInput.month);
  const dayOptions = Array.from({ length: daysInMonth }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  return (
    <Box
      display="flex"
      gap={2}
      alignItems="center"
      width={"100%"}
      className={className}
    >
      <FormControl variant="outlined" size="small" sx={{ flex: 1 }}>
        <Select
          labelId="year-label"
          value={profileInput.year}
          onChange={(e) => {
            setProfileInput((prev) => ({ ...prev, year: e.target.value }));
          }}
          displayEmpty
        >
          <MenuItem value="">년도</MenuItem>
          {yearOptions.map((y) => (
            <MenuItem value={y} key={y}>
              {y}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" size="small" sx={{ flex: 1 }}>
        <Select
          labelId="month-label"
          value={profileInput.month}
          onChange={(e) => {
            setProfileInput(() => ({ ...profileInput, month: e.target.value }));
          }}
          displayEmpty
          disabled={!profileInput.year}
        >
          <MenuItem value="">월</MenuItem>
          {monthOptions.map((m) => (
            <MenuItem value={m} key={m}>
              {m}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" size="small" sx={{ flex: 1 }}>
        <Select
          labelId="day-label"
          value={profileInput.day}
          onChange={(e) => {
            setProfileInput(() => ({ ...profileInput, day: e.target.value }));
          }}
          displayEmpty
          disabled={!profileInput.year || !profileInput.month}
        >
          <MenuItem value="">일</MenuItem>
          {dayOptions.map((d) => (
            <MenuItem value={d} key={d}>
              {d}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default Birth;
