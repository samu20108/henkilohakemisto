import {
  Typography,
  Alert,
  Backdrop,
  CircularProgress,
  List,
  ListItemText,
  Stack,
  ListItem,
  Container,
  ListItemAvatar,
  Avatar,
  Button,
  Dialog,
  Card,
  CardActions,
  CardContent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./App.css";
import differenceInYears from "date-fns/differenceInYears";

interface Henkilo {
  id: number;
  etunimi: string;
  sukunimi: string;
  titteli: string;
  sukupuoli: string;
  puhelin: string;
  aloittanutPvm: string;
  aloittanutAikaleima: number;
  sahkoposti: string;
  kuva: string;
}
interface ApiData {
  personnel: Henkilo[];
  error: string;
  fetched: boolean;
}

const App: React.FC = (): React.ReactElement => {
  const [apiData, setApiData] = useState<ApiData>({
    personnel: [],
    error: "",
    fetched: false,
  });

  const apiCall = async (): Promise<void> => {
    try {
      const connection = await fetch("http://localhost:3105/api/personnel");

      if (connection.status === 200) {
        const personnel = await connection.json();

        if (personnel.length < 1) {
          setApiData({
            ...apiData,
            error: "Ei henkilötietoja",
            fetched: true,
          });
        } else {
          setApiData({
            ...apiData,
            personnel: personnel,
            fetched: true,
          });
        }
      } else {
        setApiData({
          ...apiData,
          error: "Palvelimella tapahtui odottamaton virhe",
          fetched: true,
        });
      }
    } catch (e: any) {
      setApiData({
        ...apiData,
        error: "Palvelimeen ei saada yhteyttä",
        fetched: true,
      });
    }
  };
  useEffect(() => {
    apiCall();
  }, []);

  const [open, setOpen] = useState(-1);

  const handleClickOpen = (id: number) => {
    if (open === -1) {
      setOpen(id);
    }
  };

  const handleClose = () => {
    setOpen(-1);
    console.log(open);
  };

  return (
    <Container>
      <Typography variant="h5">Työntekijät</Typography>
      {Boolean(apiData.error) ? (
        <Alert severity="error">{apiData.error}</Alert>
      ) : apiData.fetched ? (
        <Stack>
          <List>
            {apiData.personnel.map((person: Henkilo, idx: number) => {
              const yearsOfService = differenceInYears(
                new Date(),
                new Date(person.aloittanutAikaleima)
              );

              return (
                <ListItem key={idx} onClick={() => handleClickOpen(person.id)}>
                  <ListItemAvatar>
                    <Avatar
                      alt={person.etunimi}
                      src={`http://localhost:3105/api/img/personnel/${person.kuva}`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${person.etunimi} ${person.sukunimi}`}
                    secondary={person.titteli}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => handleClickOpen(person.id)}
                  >
                    Näytä lisää
                  </Button>
                  <Dialog
                    onClose={() => handleClose()}
                    open={open === person.id}
                  >
                    <Card sx={{ minWidth: 275 }}>
                      <CardContent>
                        <Avatar
                          alt={person.etunimi}
                          src={`http://localhost:3105/api/img/personnel/${person.kuva}`}
                        />
                        <Typography variant="h5">
                          {`${person.etunimi} ${person.sukunimi}`}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ mb: 2.5 }}
                        >
                          {person.titteli}
                        </Typography>
                        <Typography>Yhteystiedot</Typography>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ mb: 2.5 }}
                        >
                          Puh: {person.puhelin}
                          {<br />}
                          Sähköposti: {person.sahkoposti}
                        </Typography>
                        <Typography>Työsuhteen kesto</Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          {yearsOfService}{" "}
                          {yearsOfService === 1 ? "vuosi" : "vuotta"}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button onClick={() => handleClose()}>Sulje</Button>
                      </CardActions>
                    </Card>
                  </Dialog>
                </ListItem>
              );
            })}
          </List>
        </Stack>
      ) : (
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Container>
  );
};

export default App;
