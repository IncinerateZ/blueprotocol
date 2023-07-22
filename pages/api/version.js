export default function handler(req, res) {
    const VERSION = '20230723-1';
    res.status(200).json({ version: VERSION });
}
