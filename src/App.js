import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";

function App() {
  const [searchText, setSearchText] = useState("");
  const [rowData, setRowData] = useState([]);

  const columnDefs = [
    { field: "HP_Terms" },
    { field: "Description" },
    { field: "K" },
    { field: "P" },
    { field: "V" },
    { field: "NK" },
    { field: "NP" },
    { field: "NV" },
  ];

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      if (searchText.trim() === "") {
        setRowData([]);
      } else {
        const res = await axios.get(
          `https://hpo-server.azurewebsites.net/${searchText}`
        );
        setRowData(res.data);
        console.log(res);
      }
    }
  };

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
      {rowData?.length > 0 && (
        <div className="ag-theme-alpine w-full h-full mt-12">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            //@ts-ignore
            style={{ height: "fit-content", width: "100%" }}
          ></AgGridReact>
        </div>
      )}
    </div>
  );
}

export default App;
