export default function handler(req, res) {
    const VERSION = '20230712-4';
    res.status(200).json({ version: VERSION });
}
