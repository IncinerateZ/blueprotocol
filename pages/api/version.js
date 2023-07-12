const VERSION = '20230712-1';

export default function handler(req, res) {
    res.status(200).json({ version: VERSION });
}
