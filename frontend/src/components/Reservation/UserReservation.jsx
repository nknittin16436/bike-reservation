import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import ReservationCard from "./ReservationCard";
import { createTheme, Grid } from "@mui/material";
import { getUserReservations } from "../../Service/ReservationService";
import { useSearchParams } from "react-router-dom";
import Loader from "../Loader/Loader";

const { Content } = Layout;

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 1120,
      sm: 1120,
      md: 1536,
      lg: 1536,
      xl: 1536,
    },
  },
});

const UserReservation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllReservations = async () => {
    try {
      setLoading(true);
      const data = await getUserReservations(userId);
      setReservations(data.reservations);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert.show(error.message);
    }
  };

  useEffect(() => {
    getAllReservations();
  }, []);
  return (
    <div className="reservation">
      {loading ? (
        <Loader />
      ) : (
        <div className="reservation__container">
          <h1>User Reservations</h1>
          <Layout>
            <Layout className="site-layout">
              <Content
                className="site-layout-background"
                style={{
                  margin: "50px 25px",
                  padding: 25,
                }}
              >
                <div className="reservations__cards">
                  <Grid
                    container
                    spacing={2}
                    theme={theme}
                    // alignItems="stretch"
                  >
                    {reservations &&
                      reservations.map((reservation) => (
                        <Grid
                          item
                          xs={12}
                          lg={6}
                          sm={12}
                          md={12}
                          key={reservation.id}
                        >
                          <ReservationCard
                            reservation={reservation}
                            key={reservation.id}
                            getAllReservations={getAllReservations}
                            setLoading={setLoading}
                          />
                        </Grid>
                      ))}
                  </Grid>
                  {reservations.length===0 && <h3>No reservations yet</h3>}
                </div>
              </Content>
            </Layout>
          </Layout>
        </div>
      )}
    </div>
  );
};

export default UserReservation;
