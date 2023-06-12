import React, { useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, limit, where, getDocs } from "@firebase/firestore";
import { db } from "../../firebaseConfig";
import { AuthContext } from "../../auth/auth";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ReportTemplateCard from '../../components/ReportTemplateCard/ReportTemplateCard';
import ReportNewCard from '../../components/ReportNewCard/ReportNewCard';
import withLayout from '../../components/WithLayout/WithLayout';
import NavButton from '../../components/NavButton/NavButton';
import { Card, CardContent, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Jan', uv: 4000, pv: 2400, amt: 2400,
  },
  {
    name: 'Feb', uv: 3000, pv: 1398, amt: 2210,
  },
  {
    name: 'Mar', uv: 2000, pv: 9800, amt: 2290,
  },
  {
    name: 'Apr', uv: 2780, pv: 3908, amt: 2000,
  },
  {
    name: 'May', uv: 1890, pv: 4800, amt: 2181,
  },
  {
    name: 'Jun', uv: 2390, pv: 3800, amt: 2500,
  },
  {
    name: 'Jul', uv: 3490, pv: 4300, amt: 2100,
  },
];

function SimpleLineChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
function ChartCard() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} >
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              Sales Overview
            </Typography>
            <div style={{ width: '100%', height: 300 }}>
              <SimpleLineChart />
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}




const ReportCardListPage = () => {
  const { user } = useContext(AuthContext);
  const [reportTemplates, setReportTemplates] = useState([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const reportTemplatesCollectionRef = collection(db, "reportTemplates");
    const reportsCollectionRef = collection(db, "reports");

    const unsubscribe = onSnapshot(reportTemplatesCollectionRef, async (snapshot) => {
      const fetchedTemplates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      for (let template of fetchedTemplates) {
        const reportsQuery = query(
          reportsCollectionRef,
          where("userId", "==", user.uid),
          where("reportType", "==", template.type),
          orderBy("timestamp", "desc"),
          limit(1)
        );

        const reportSnapshot = await getDocs(reportsQuery);
        const report = reportSnapshot.docs[0]?.data();

        template.latestReport = report || null;
      }

      setReportTemplates(fetchedTemplates);
    });

    return () => unsubscribe();
  }, [user]);


  return (
    <Box
      sx={{
        overflowY: 'auto',
        height: '100vh',
        padding: '10px',
        paddingTop: '70px',
        boxSizing: 'border-box'
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <ReportNewCard />
        </Grid>
        {reportTemplates.map((template, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <ReportTemplateCard
              reportTemplate={template}
              latestReport={template.latestReport}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const LogsButton = () => NavButton({ to: "/logs", text: "Logs" });

export default withLayout(ReportCardListPage, {
  menuComponents: [LogsButton],
  handleSubmit: () => { },
  selectedDay: new Date(),
  setSelectedDay: () => { },
});
