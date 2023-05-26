import React, { useEffect, useState, useContext } from 'react';
import { CircularProgress, Typography, Box, Card, Button } from '@mui/material';
import { AuthContext } from '../../auth/auth';
import { TimePeriodContext } from '../../contexts/TimePeriodContext';
import { db, functions } from '../../firebaseConfig';
import withLayout from '../../components/WithLayout/WithLayout';
import { collection, query, where, onSnapshot, limit } from '@firebase/firestore';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { httpsCallable } from 'firebase/functions';
import { Link } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { MuiMarkdown } from 'mui-markdown';

const GenerateReportButton = () => {
    const generateReport = async () => {
        const generateReportFunction = httpsCallable(functions, 'generateReport');
        await generateReportFunction();
    };

    return (
        <Button variant="contained" color="primary" onClick={generateReport}>
            Generate Report
        </Button>
    )
}

const GoHomeButton = () => (
    <Button variant="contained" component={Link} to="/" sx={{ ml: 2 }}>
        Go Home
    </Button>
);

const ReportsPage = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const { startDate, endDate } = useContext(TimePeriodContext);

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'reports'),
            where('userId', '==', user.uid),
            where('createdAt', '>=', startDate),
            where('createdAt', '<=', endDate),
            limit(1));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                setReport(snapshot.docs[0].data().text);
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, [user, startDate, endDate]);

    let rows = [];
    if (report) {
        const tableRows = report.split('\n');
        rows = tableRows.map((row) => {
            const [_, task, start, end, location, people] = row.split('|').map((cell) => cell.trim());
            return { task, start, end, location, people };
        });
    } 


    return (
        <div>
            {loading ? (
                <CircularProgress />
            ) : report ? (
                <Card sx={{ marginTop: "10px", marginBottom: "10px", borderRadius: "5px", boxShadow: 1 }}>
                    <Box sx={{ typography: 'body1', p: 2 }}>
                        {/* <MuiMarkdown>{report}</MuiMarkdown> */}

                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">Task</TableCell>
                                        <TableCell align="right">Start</TableCell>
                                        <TableCell align="right">End</TableCell>
                                        <TableCell align="right">Location</TableCell>
                                        <TableCell align="right">People</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="right">{row.task}</TableCell>
                                            <TableCell align="right">{row.start}</TableCell>
                                            <TableCell align="right">{row.end}</TableCell>
                                            <TableCell align="right">{row.location}</TableCell>
                                            <TableCell align="right">{row.people}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Card>
            ) : null}
        </div>
    );
};

export default withLayout(ReportsPage, {
    menuComponents: [GenerateReportButton, GoHomeButton],
    handleSubmit: (e) => {
        console.log("submit");
    },
});
