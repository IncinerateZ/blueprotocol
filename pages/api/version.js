const VERSION = new Date().getTime();
export default function handler(req, res) {
    res.status(200).json({ version: VERSION });
}
