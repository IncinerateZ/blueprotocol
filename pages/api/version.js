export default function handler(req, res) {
    const VERSION = '20230803-2';
    res.status(200).json({ version: VERSION });
}
