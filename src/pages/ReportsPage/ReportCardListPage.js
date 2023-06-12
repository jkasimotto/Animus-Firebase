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
