import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import orteRoutes from './src/routes/orteRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import helmet from 'helmet'

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(helmet())

app.use("/api/orte", orteRoutes);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Backend läuft");
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});