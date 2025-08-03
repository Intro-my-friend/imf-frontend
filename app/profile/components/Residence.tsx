import { regions } from "@/app/profile/components/regions";
import { ProfileInputType } from "@/app/profile/page";
import { DefaultProps } from "@/type/props";
import { Box, FormControl, MenuItem, Select } from "@mui/material";

type Props = {
  profileInput: ProfileInputType;
  setProfileInput: React.Dispatch<React.SetStateAction<ProfileInputType>>;
} & DefaultProps;

function Residence({ profileInput, setProfileInput, className }: Props) {
  const sidoOptions = regions.map((r) => r.sido);
  const selectedSido = regions.find(
    (r) => r.sido === profileInput.residenceSido,
  );
  const gugunOptions = selectedSido ? selectedSido.gugun : [];

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
          value={profileInput.residenceSido || ""}
          displayEmpty
          onChange={(e) => {
            setProfileInput((prev) => ({
              ...prev,
              residenceSido: e.target.value,
              residenceGugun: "",
            }));
          }}
        >
          <MenuItem value="">시/도</MenuItem>
          {sidoOptions.map((sido) => (
            <MenuItem value={sido} key={sido}>
              {sido}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl variant="outlined" size="small" sx={{ flex: 1 }}>
        <Select
          value={profileInput.residenceGugun || ""}
          displayEmpty
          disabled={!profileInput.residenceSido}
          onChange={(e) => {
            setProfileInput((prev) => ({
              ...prev,
              residenceGugun: e.target.value,
            }));
          }}
        >
          <MenuItem value="">구/군</MenuItem>
          {gugunOptions.map((gugun) => (
            <MenuItem value={gugun} key={gugun}>
              {gugun}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default Residence;
