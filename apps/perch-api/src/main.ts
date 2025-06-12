import app from './app';
import { connectToDB } from './database/connectDB';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, host, async () => {
  await connectToDB();
  console.log(`🚀 Listening at http://${host}:${port}`);
});
