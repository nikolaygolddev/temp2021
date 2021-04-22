const backend = require('backend-module');
const { request, response } = require('express');
const express = require('express');
var app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/',(request, response)=>{
    response.send("/ server is working!");
});

app.get('/products',(request, response)=>{
    response.send(backend.getProducts());
});

app.delete('/delete/:id',(request, response)=>{
    backend.deleteProduct(request.params["id"]);
    response.end("Deleted!");
});

app.post('/addproduct',(request, response)=>{
    backend.addProduct(request.body);
    response.end("Added!");
})

app.post('/update/:id',(request, response)=>{
    backend.updateProduct(request.params["id"],request.body);
    response.end("Updated!");
});

app.get('/category/:params',(request, response)=>{
    response.send(backend.getCategory(request.params["params"]));
});

app.listen(port,()=>{
    console.log(`Server started on port: ${port}`)
});