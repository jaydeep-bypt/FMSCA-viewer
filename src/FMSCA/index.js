import React, { useState, useEffect, useMemo, useCallback } from "react";
import Papa from "papaparse";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { GridToolbar } from "@mui/x-data-grid-pro";
import {
  CustomDataGridPro,
  StyledPaper,
  StyledTextField,
  StyledTitle,
} from "./styles";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const useFilteredSortedData = (data, filter, order, orderBy, setLoading) => {
  const debouncedFilter = useDebounce(filter, 300);

  useEffect(() => {
    if (!data.length) return;
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [debouncedFilter, data.length, setLoading]);

  const filteredData = useMemo(() => {
    if (!debouncedFilter) return data;
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(debouncedFilter.toLowerCase())
      )
    );
  }, [data, debouncedFilter]);

  const sortedData = useMemo(() => {
    if (!orderBy) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, order, orderBy]);

  return sortedData;
};

const FMSCAViewer = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("created_dt");
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const memoizedSetLoading = useCallback((value) => {
    setLoading(value);
  }, []);

  useEffect(() => {
    fetch("/data/FMSCA.csv")
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const csvData = results.data;

            if (csvData.length > 0) {
              const headerKeys = Object.keys(csvData[0]);

              const columnWidths = {
                created_dt: 180,
                data_source_modified_dt: 220,
                entity_type: 130,
                operating_status: 220,
                legal_name: 250,
                dba_name: 250,
                physical_address: 400,
                p_street: 200,
                p_city: 190,
                p_state: 100,
                p_zip_code: 100,
                phone: 120,
                mailing_address: 400,
                m_street: 200,
                m_city: 190,
                m_state: 100,
                m_zip_code: 100,
                usdot_number: 150,
                mc_mx_ff_number: 150,
                power_units: 120,
                mcs_150_form_date: 160,
                out_of_service_date: 180,
                state_carrier_id_number: 210,
                duns_number: 150,
                drivers: 150,
                mcs_150_mileage_year: 180,
                id: 100,
                credit_score: 120,
                record_status: 150,
              };

              const generatedColumns = headerKeys.map((key) => ({
                field: key,
                headerName: key.replace(/_/g, " ").toUpperCase(),
                width: columnWidths[key],
                flex: 0,
              }));

              setData(csvData);
              setColumns(generatedColumns);
            }
          },
          error: (error) => {
            console.error("Error parsing CSV file:", error);
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching CSV file:", error);
      });

    setTimeout(() => {
      const targetDiv = document.querySelector(
        'div[style*="position: absolute"][style*="pointer-events: none"]'
      );
      if (targetDiv) {
        targetDiv.style.width = "0%";
      }
    }, 100);
  }, []);

  const sortedData = useFilteredSortedData(
    data,
    filter,
    order,
    orderBy,
    memoizedSetLoading
  );

  const handleFilterChange = (event) => {
    const value = event?.target?.value;
    if (value.length <= 100) {
      setFilter(value);
      if (!value) {
        setOrder("asc");
        setOrderBy("created_dt");
      }
    }
  };

  return (
    <StyledPaper>
      <StyledTitle>FMSCA</StyledTitle>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "10px",
          width: "60%",
        }}
      >
        <label htmlFor="search-field" style={{ marginRight: "10px" }}>
          Search:
        </label>
        <StyledTextField
          id="search-field"
          size="small"
          variant="outlined"
          onChange={handleFilterChange}
          value={filter}
          style={{ width: "100%", height: "40px" }}
        />
      </div>
      <Backdrop style={{ zIndex: 1000, color: "#fff" }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div style={{ height: "88vh", width: "100%" }}>
        <CustomDataGridPro
          rows={sortedData}
          columns={columns}
          pageSize={rowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          pagination
          disableSelectionOnClick
          components={{ Toolbar: GridToolbar }}
          onPageSizeChange={(newPageSize) => setRowsPerPage(newPageSize)}
          onSortModelChange={(sortModel) => {
            if (sortModel.length) {
              const { field, sort } = sortModel[0];
              setOrderBy(field);
              setOrder(sort);
            } else {
              setOrderBy("created_dt");
              setOrder("asc");
            }
          }}
          columnReorder
          columnResize
        />
      </div>
    </StyledPaper>
  );
};

export default FMSCAViewer;
