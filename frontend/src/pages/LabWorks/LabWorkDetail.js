import React from "react";
import { Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

function LabWorkDetail() {
  const { id } = useParams();

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Деталі лабораторної роботи #{id}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        TODO: Implement lab work details
      </Typography>
    </Container>
  );
}

export default LabWorkDetail;
