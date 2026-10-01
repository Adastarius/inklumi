import { supabaseAdmin } from '../config/supabaseAdmin.js'

//prüft, ob Nutzer einen gültigen Supabase-Login-Token mitsendet
async function authMiddleware(req, res, next) {
    //extrahiert den Bearer Token vom Header
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Kein Token vorhanden. Bitte einloggen."})
    }

    //extrahiert den eigentlichen Token
    const token = authHeader.split(" ")[1]

    try {
        //Supabase prüft den Token und ermittelt den zugehörigen Nutzer
        const { data, error } = await supabaseAdmin.auth.getUser(token)

        //Behandlung von Supabase-Fehlern
        if (error || !data.user) {
            return res.status(401).json({ error: "Token ist ungültig oder abgelaufen."})
        }

        req.userId = data.user.id
        next()
    } catch (error) {
        console.error(error)
        return res.status(401).json({ error: "Token konnte nicht geprüft werden."})
    }
}
export default authMiddleware