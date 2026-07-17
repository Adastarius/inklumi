import jwt from 'jsonwebtoken'

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ fehler: "Kein Token vorhanden. Bitte einloggen."})
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()
    } catch (error) {
        console.error(error)
        return res.status(401).json({ fehler: "Token ist ungültig oder abgelaufen."})
    }
}
export default authMiddleware