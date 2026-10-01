import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import placesRoutes from './src/routes/placesRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import helmet from 'helmet'
import reviewRoutes from './src/routes/reviewRoutes.js'
import badgeRoutes from './src/routes/badgeRoutes.js'
import geocode from './src/routes/geocode.js'
import uploadRoutes from './src/routes/uploadRoutes.js'
import contactRoutes from './src/routes/contactRoutes.js'

//Erstellung des Backend-Servers
const app = express();
const PORT = 3000;

//erlaubt Anfragen vom Frontend (Cross-Origin)
app.use(cors());
//ermöglicht das Lesen von JSON-Anfragen
app.use(express.json());
//setzt sicherheitsrelevante HTTP-Header
app.use(helmet())

//Registrierung der Routen
app.use("/api/orte", placesRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/bewertungen", reviewRoutes)

app.use("/api/badges", badgeRoutes)

app.use("/api", geocode)

app.use("/api", uploadRoutes)

app.use("/api", contactRoutes)

app.get("/", (req, res) => {
    res.send("Backend läuft");
});

//startet den Server
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});