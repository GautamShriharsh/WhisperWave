import express from 'express'
import dotenv from 'dotenv';
import connectToMongoDB from './db/connectToMongoDB.js'
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json()); // Middleware for parsing JSON payload from req.body

app.use('/api/auth', authRoutes)


// app.get('/', (req,res) => {
//     //root route http://localhost:5000/
//     res.send("Hello World! how are you doing");
// })


app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server Running on port ${PORT}`);
});

 
