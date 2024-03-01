const express = require('express')

const app = express();

app.get('/', (req,res) => {
    //root route http://localhost:5000/
    res.send("Hello World! how are you doing");
})


app.listen(5000, () => console.log('Server Running on port 5000'));


