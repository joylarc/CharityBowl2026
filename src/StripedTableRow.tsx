import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";

const StripedTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.background.default,
  },
}));

export default StripedTableRow;
