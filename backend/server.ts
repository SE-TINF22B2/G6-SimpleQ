import express, { Request, Response } from 'express';
import HelloWorld from './api/test/route';

const app = express();
const port = 7070;

app.get('/test', (req: Request, res: Response) => {
    let test: String = HelloWorld();
    res.send(test);
});

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});