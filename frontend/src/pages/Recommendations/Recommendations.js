import React from "react";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Box,
} from "@mui/material";
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

function Recommendations() {
  const weakTopics = [
    { topic: "Алгоритми сортування", level: "weak" },
    { topic: "Рекурсія", level: "medium" },
  ];

  const studyPlan = [
    { task: "Повторити матеріал по алгоритмах", hours: 3, priority: "high" },
    {
      task: "Виконати додаткові вправи з рекурсії",
      hours: 2,
      priority: "medium",
    },
    {
      task: "Переглянути лекції по структурах даних",
      hours: 1,
      priority: "low",
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Рекомендації
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Персональний план підготовки та рекомендації для покращення
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Теми, що потребують уваги
        </Typography>
        <List>
          {weakTopics.map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <WarningIcon color="warning" />
              </ListItemIcon>
              <ListItemText primary={item.topic} />
              <Chip
                label={item.level === "weak" ? "Слабо" : "Середньо"}
                color={item.level === "weak" ? "error" : "warning"}
                size="small"
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          План підготовки
        </Typography>
        <List>
          {studyPlan.map((item, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <InfoIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={item.task}
                secondary={`Рекомендований час: ${item.hours} год`}
              />
              <Chip
                label={item.priority}
                color={getPriorityColor(item.priority)}
                size="small"
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default Recommendations;
