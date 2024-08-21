import React, { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";
import TableView from "./components/TableView";
import PivotTable from "./components/PivotTableView";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { StyledPaper, StyledTitle, ToggleButton, StyledHeader } from "./styles";

const FMSCAViewer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [view, setView] = useState("tableView");

  useEffect(() => {
    setLoading(true);
    fetch("/data/FMSCA.csv")
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            setData(results.data);
            setLoading(false);
          },
          error: (error) => {
            console.error("Error parsing CSV file:", error);
            setLoading(false);
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching CSV file:", error);
        setLoading(false);
      });
  }, []);

  const handleViewSwitch = useCallback(() => {
    setViewLoading(true);
    setTimeout(() => {
      setView(view === "tableView" ? "pivotTable" : "tableView");
      setViewLoading(false);
    }, 500); // Adjust the delay as needed
  }, [view]);

  return (
    <StyledPaper>
      <StyledHeader>
        <StyledTitle>FMSCA</StyledTitle>
        <ToggleButton onClick={handleViewSwitch}>
          {view === "tableView" ? "Pivot Table" : "Table View"}
        </ToggleButton>
      </StyledHeader>

      <Backdrop
        style={{ zIndex: 1000, color: "#fff" }}
        open={loading || viewLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {data.length > 0 &&
        !viewLoading &&
        (view === "tableView" ? (
          <TableView data={data} />
        ) : (
          <PivotTable data={data} />
        ))}
    </StyledPaper>
  );
};

export default FMSCAViewer;
