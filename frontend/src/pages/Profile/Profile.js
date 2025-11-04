import React from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
} from "@mui/material";

function Profile() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Профіль студента
      </Typography>

      <Paper sx={{ p: 4, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ім'я користувача"
              defaultValue="student123"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              defaultValue="student@example.com"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Повне ім'я"
              defaultValue="Іванов Іван Іванович"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Група" defaultValue="ІП-21" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Факультет"
              defaultValue="Інформаційні технології"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Курс" defaultValue="3" />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary">
              Зберегти зміни
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Profile;
