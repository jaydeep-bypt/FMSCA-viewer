import styled from "styled-components";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { Typography, Paper, TextField } from "@mui/material";

export const CustomDataGridPro = styled(DataGridPro)`
  .MuiDataGrid-columnHeader {
    background-color: #079ae3;
  }

  .MuiDataGrid-columnHeaderTitle {
    font-weight: bold;
  }

  .MuiDataGrid-sortIcon {
    color: #000000;
  }

  .MuiDataGrid-columnHeader:active {
    background-color: #079ae3 !important;
  }
`;

export const StyledTitle = styled(Typography)`
  padding: 10px 0 10px 10px !important;
  height: 25px;
  font-size: 1.3rem !important;
  font-weight: 700 !important;
  color: #ffff;
  background: #079ae3;
  margin-bottom: 20px;
  // text-align: center;
  align-content: center !important;
`;

export const StyledPaper = styled(Paper)`
  height: 100%;
  width: 100%;
  // margin: 20px;
  // padding: 20px;
  // box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
`;

export const StyledTextField = styled(TextField)`
  background-color: white !important;
  border-radius: 10px !important;
  & .MuiInputBase-root {
    // color: #4a4a4a;
  }
  & .MuiOutlinedInput-root {
    border-radius: 4px;
    fieldset {
      // border-color: #b0b0b0;
    }
    &:hover fieldset {
      // border-color: #007bff;
    }
    &.Mui-focused fieldset {
      // border-color: #0056b3;
    }
  }
`;
