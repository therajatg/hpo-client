import { useState, useCallback, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";

function App() {
  const gridRefTerm = useRef();
  const gridRefDisease = useRef();
  const [searchText, setSearchText] = useState("");
  const [termData, setTermData] = useState([]);
  const [diseaseData, setDiseaseData] = useState([]);
  const [active, setActive] = useState(1);

  const termColDef = [
    { field: "HP_Terms" },
    { field: "Description" },
    { field: "K" },
    { field: "P" },
    { field: "V" },
    { field: "NK" },
    { field: "NP" },
    { field: "NV" },
  ];

  const diseaseColDef = [
    { field: "disease_id" },
    { field: "disease_name" },
    { field: "v_count" },
    { field: "p_count" },
    { field: "k_count" },
    { field: "nv_count" },
    { field: "np_count" },
    { field: "nk_count" },
  ];

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      resizable: true,
      minWidth: 100,
      flex: 1,
    };
  }, []);

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      if (searchText.trim() === "") {
        setTermData([]);
        setDiseaseData([]);
      } else {
        const res = await axios.get(
          `https://hpo-server.azurewebsites.net/${searchText}`
        );
        // const res = await axios.get(`http://localhost:8000/${searchText}`);
        if (res.status === 201) {
          setTermData(res.data.termData);
          setDiseaseData(res.data.diseaseData);
        }
      }
    }
  };

  const onBtnExportTerm = useCallback(() => {
    gridRefTerm.current.api.exportDataAsCsv();
  }, []);

  const onBtnExportDisease = useCallback(() => {
    gridRefDisease.current.api.exportDataAsCsv();
  }, []);

  return (
    <div className="w-100 h-full flex flex-col items-center">
      <input
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[50%] p-2.5"
        placeholder="Search for diseases and phentotypes"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        required
        onKeyDown={handleKeyDown}
      />
      <div className="flex items-center justify-between w-full mt-16">
        <div>
          {termData?.length > 0 && (
            <button
              className={`${
                active === 1
                  ? "bg-blue-500 text-white"
                  : "bg-transparent text-blue-700 border-blue-500"
              } font-semibold py-2 px-4 rounded border`}
              onClick={() => {
                if (active === 2) setActive(1);
              }}
            >
              Term Results
            </button>
          )}
          {diseaseData?.length > 0 && (
            <button
              className={`${
                active === 2
                  ? "bg-blue-500 text-white"
                  : "bg-transparent text-blue-700 border-blue-500"
              } font-semibold py-2 px-4 rounded border`}
              onClick={() => {
                if (active === 1) setActive(2);
              }}
            >
              Disease Results
            </button>
          )}
        </div>
        <div>
          {active === 1 && termData?.length > 0 && (
            <button
              onClick={onBtnExportTerm}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded border"
            >
              Download Term Results
            </button>
          )}
          {active === 2 && diseaseData?.length > 0 && (
            <button
              onClick={onBtnExportDisease}
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded border"
            >
              Download Disease Results
            </button>
          )}
        </div>
      </div>
      {termData?.length > 0 && active === 1 && (
        <div className="ag-theme-alpine w-full h-full">
          <AgGridReact
            ref={gridRefTerm}
            rowData={termData}
            columnDefs={termColDef}
            defaultColDef={defaultColDef}
            style={{ height: "fit-content", width: "100%" }}
          ></AgGridReact>
        </div>
      )}
      {diseaseData?.length > 0 && (active === 2 || termData?.length === 0) && (
        <div className="ag-theme-alpine w-full h-full">
          <AgGridReact
            ref={gridRefDisease}
            rowData={diseaseData}
            columnDefs={diseaseColDef}
            defaultColDef={defaultColDef}
            style={{ height: "fit-content", width: "100%" }}
          ></AgGridReact>
        </div>
      )}
    </div>
  );
}

export default App;
