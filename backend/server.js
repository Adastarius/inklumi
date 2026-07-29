import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import placesRoutes from './src/routes/placesRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import helmet from 'helmet'
import reviewRoutes from './src/routes/reviewRoutes.js'
import badgeRoutes from './src/routes/badgeRoutes.js'
import geocode from './src/routes/geocode.js'

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(helmet())

app.use("/api/orte", placesRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/bewertungen", reviewRoutes)

app.use("/api/badges", badgeRoutes)

app.use("/api", geocode)

app.get("/", (req, res) => {
    res.send("Backend läuft");
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});