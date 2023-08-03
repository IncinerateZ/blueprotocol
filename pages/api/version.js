export default function handler(req, res) {
    const VERSION = '20230803-5';
    res.status(200).json({ version: VERSION });
}
