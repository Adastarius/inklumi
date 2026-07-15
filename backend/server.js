import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import orteRoutes from './src/routes/orteRoutes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/orte", orteRoutes);

app.get("/", (req, res) => {
    res.send("Backend läuft");
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});