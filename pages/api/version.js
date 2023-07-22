export default function handler(req, res) {
    const VERSION = '20230723-2';
    res.status(200).json({ version: VERSION });
}
