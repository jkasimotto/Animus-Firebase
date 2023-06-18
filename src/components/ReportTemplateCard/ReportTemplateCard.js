import { collection, deleteDoc, doc, limit, onSnapshot, query, updateDoc, where, orderBy } from "@firebase/firestore";
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete Icon
import EditIcon from '@mui/icons-material/Edit'; // Import Edit Icon
import MaximizeIcon from '@mui/icons-material/Maximize';
import MinimizeIcon from '@mui/icons-material/Minimize';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { DataGrid } from '@mui/x-data-grid'; // Import DataGrid
import { endOfDay, startOfDay } from 'date-fns';
import dayjs from 'dayjs';
import { httpsCallable } from 'firebase/functions';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../auth/auth';
import { TimePeriodContext } from "../../contexts/TimePeriodContext";
import { db, functions } from "../../firebaseConfig";



const ReportTemplateCard = ({ reportTemplate }) => {
  const { user } = useContext(AuthContext);
  const { startDate, endDate } = useContext(TimePeriodContext);
  const [tableData, setTableData] = useState({ headers: [], rows: [] });
  const [tableId, setTableId] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(reportTemplate.systemPrompt);
  const [isLoading, setIsLoading] = useState(false); // new state for loading status

  console.log(reportTemplate.id)

  const deleteReportTemplate = async () => {
    console.log("Deleting report template: ", reportTemplate.id);
    const reportTemplateRef = doc(db, "reportTemplates", reportTemplate.id);
    await deleteDoc(reportTemplateRef);
  };

  const updatePrompt = async () => {
    const reportTemplateRef = doc(db, "reportTemplates", reportTemplate.id);
    await updateDoc(reportTemplateRef, { systemPrompt: editedPrompt });
    fetchTableData();  // refresh data after the update
  };

  const handlePromptChange = (event) => {
    setEditedPrompt(event.target.value);
  };

  const fetchTableData = () => {
    console.log("Start date: ", startDate.toDate());
    console.log("End date: ", endDate.toDate());
    const reportDataCollectionRef = collection(db, "reports");
    const reportDataQuery = query(
      reportDataCollectionRef,
      where("userId", "==", user.uid),
      where("reportType", "==", reportTemplate.type),
      where("date", ">=", startDate.toDate()),
      where("date", "<=", endDate.toDate()),
      orderBy("date", "desc"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    onSnapshot(reportDataQuery, (snapshot) => {
      console.log("Snapshot", snapshot.size);
      if (snapshot.size == 0) {
        setTableData({ headers: [], rows: [] });
        setTableId(null); // Set table ID to null if no data is found
        return;
      }
      const data = snapshot.docs[0].data();
      if (data.text) {
        console.log("Found data: ", data.text);
        const tableData = parseMarkdownTable(data.text);
        setTableData(tableData);
        setTableId(snapshot.docs[0].id); // Set table ID to Firestore ID
      } else {
        setTableData({ headers: [], rows: [] });
        setTableId(null); // Set table ID to null if no data is found
      }
    });
  };

  function parseMarkdownTable(mdTable) {
    // Split the markdown table into lines
    const lines = mdTable.split("\n");

    // Ignore the second line (it contains table styling information)
    const relevantLines = [lines[0]].concat(lines.slice(2));

    // Split the first line into headers
    const headers = relevantLines[0].split("|").slice(1, -1).map(cell => cell.trim());

    // Split each subsequent line into cells
    const rows = relevantLines.slice(1).map(line => {
      const cells = line.split("|").slice(1, -1).map(cell => cell.trim());
      return headers.reduce((obj, header, index) => {
        obj[header] = cells[index];
        return obj;
      }, {});
    });

    return { headers, rows };
  }



  const refresh = () => {
    fetchTableData();
  };

  const generateReport = async () => {
    setIsLoading(true); // set loading before generating report
    const generateReportFunction = httpsCallable(functions, 'generateReport');
    try {
      const result = await generateReportFunction({
        reportType: reportTemplate.type,
        reportId: tableId, // pass report id
        date: dayjs(startDate).valueOf() // Here it picks the starting date from the selected range
      });
      console.log(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // set loading false after generating report
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [startDate, endDate]);

  console.log(tableData);

  const rows = tableData.rows.map((row, index) => ({ id: index, ...row }));
  const columns = tableData.headers.map(header => ({ field: header, headerName: header, flex: 1 }));

  console.log(rows);
  console.log(columns);

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        action={
          <>
            <IconButton onClick={deleteReportTemplate}>
              <DeleteIcon />
            </IconButton>
            {isLoading ? (
              <CircularProgress />
            ) : tableData.headers.length > 0 ? (
              <IconButton onClick={generateReport}>
                <RefreshIcon />
              </IconButton>
            ) : (
              <IconButton onClick={generateReport}>
                <PlayArrowIcon />
              </IconButton>
            )}
            <IconButton onClick={() => setShowTable(!showTable)}>
              {showTable ? <MinimizeIcon /> : <MaximizeIcon />}
            </IconButton>
            <IconButton onClick={() => setShowPrompt(!showPrompt)}>
              <EditIcon />
            </IconButton>
          </>
        }
        title={reportTemplate.title}
      />
      <CardContent>
        {showPrompt &&
          <TextField
            fullWidth
            multiline
            value={editedPrompt}
            onChange={handlePromptChange}
            onBlur={updatePrompt}
          />
        }
        {showTable && (
          <div style={{ height: 400, width: '100%' }}> {/* Define the dimensions of your DataGrid */}
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5} // Define the number of rows rendered in the table
              checkboxSelection
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportTemplateCard;