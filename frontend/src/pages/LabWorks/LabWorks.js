import React from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";

function LabWorks() {
  // TODO: Fetch lab works from API
  const labWorks = [
    {
      id: 1,
      title: "Лабораторна робота №1",
      topic: "Основи програмування",
      status: "completed",
      score: 85,
    },
    {
      id: 2,
      title: "Лабораторна робота №2",
      topic: "Структури даних",
      status: "pending",
      score: 0,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "approved":
        return "primary";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Виконано";
      case "pending":
        return "В очікуванні";
      case "approved":
        return "Затверджено";
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Лабораторні роботи
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Перегляд та аналіз виконаних лабораторних робіт
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <List>
          {labWorks.map((lab) => (
            <ListItem
              key={lab.id}
              sx={{
                borderBottom: "1px solid #e0e0e0",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                },
              }}
            >
              <ListItemText primary={lab.title} secondary={lab.topic} />
              <Grid
                container
                spacing={2}
                justifyContent="flex-end"
                alignItems="center"
                sx={{ width: "auto" }}
              >
                <Grid item>
                  <Chip
                    label={getStatusLabel(lab.status)}
                    color={getStatusColor(lab.status)}
                    size="small"
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body2">Бал: {lab.score}/100</Typography>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default LabWorks;
