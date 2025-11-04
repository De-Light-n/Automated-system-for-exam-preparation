import React from "react";
import { Container, Typography, Grid, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Лабораторні роботи",
      description: "Перегляд та аналіз виконаних робіт",
      color: "#1976d2",
      path: "/lab-works",
    },
    {
      title: "Аналітика",
      description: "Статистика та прогрес навчання",
      color: "#2e7d32",
      path: "/analytics",
    },
    {
      title: "Рекомендації",
      description: "Персональний план підготовки",
      color: "#ed6c02",
      path: "/recommendations",
    },
    {
      title: "Екзаменаційний тренажер",
      description: "Практика та симуляція екзамену",
      color: "#9c27b0",
      path: "/exam-trainer",
    },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Дашборд
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Ласкаво просимо до системи підготовки до іспитів
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={6} key={card.title}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                height: 140,
                cursor: "pointer",
                transition: "all 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate(card.path)}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 1,
                  backgroundColor: card.color,
                  mb: 2,
                }}
              />
              <Typography variant="h6" component="h2" gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Dashboard;
