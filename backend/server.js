import express from 'express'
import dotenv from 'dotenv';
import connectToMongoDB from './db/connectToMongoDB.js'
import authRoutes from './routes/auth.routes.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;


app.get('/', (req,res) => {
    //root route http://localhost:5000/
    res.send("Hello World! how are you doing");
})

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server Running on port ${PORT}`);
});

 
