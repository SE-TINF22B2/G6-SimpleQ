import express, { Request, Response } from 'express';
import HelloWorld from './api/test/route';

const app = express();
const port = 7070;

app.get('/api/test', HelloWorld);

app.get('/api/auth/callback', );

app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});