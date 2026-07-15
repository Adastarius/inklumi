import { PrismaClient } from '../../generated/prisma/client.ts';

//Erstellen einer Datenbankverbindung und export für andere Dateien, um viele Verbindungen zu vermeiden
const prisma = new PrismaClient();

export default prisma;