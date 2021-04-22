const express = require("express");
const fs=require("fs");
const app = express();
const path = require('path');
const axios = require('axios');
const port = 5000;
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let readView=(name)=>{
    return fs.readFileSync(path.join(__dirname+"/views/"+name+".html"),"utf-8")
}



// homepage
app.get("/",(req,res)=>{
    res.send(readView("index"));
    console.log("Server je startovan!");
});


// page for adding new product
app.get("/addproduct",(req,res)=>{
    res.send(readView("addproduct"));
});

// load all products
app.get("/products",(req,res)=>{
    
    axios.get('http://localhost:3000/products')
    .then(response => {
        let category = [];
        let categoryData = "";
        let data="";
        response.data.forEach(element => {
            let uslov = false;
            for(let i=0;i<category.length;i++)
            {
                if(category[i] == element.category)
                {
                    uslov = true;
                }
            }
            if(uslov==false)
            {
                category.push(element.category);
            }
            data+=`
            <div class="article">
                <div class="box">
                    <h2>${element.name}</h2>
                    <p class="category">${element.category}</p>
                    <p class="price">${element.price} RSD</p>
            `;
            if(element.discounts.price != "")
            {
                data+=`
                <p class="discount">${element.discounts.price} RSD</p>`;
            }
            data+=`<p class="tags">`;
            for(let i=0;i<5;i++)
            {
                if(element.tags[i] != "")
                {
                    data+=`#${element.tags[i]} `;
                }
            }
            data+=`</p>`;
            data+=`
                </div>
                <div class="row">
                    <a href="/delete/${element.id}"><div id="delete" class="button">Obriši</div></a>
                    <a href="/edit/${element.id}"><div id="edit" class="button">Uredi</div></a>
                </div>
            </div>
            `;
        });
        categoryData+=`<div class=article>
        <div class="box">
            <h4>IZABERI KATEGORIJU:</h4>`;
        for(let i = 0; i < category.length;i++)
        {
            if(category[i] != "")
            {
            categoryData+=`
            <a class="linkCat" href="/products/${category[i]}">
                <div class="row">
                    <div class="categoryPlaceholder">
                        <div class="row">
                            <div class="check"></div><div class="categoryText">${category[i]}</div>
                        </div>
                    </div>
                </div>
            </a>`
            }
        }
        categoryData+=`     </div>
        </div>`
        res.send(readView("products").replace("#{data}",data).replace("#{category}",categoryData));
    })
    .catch(error => {
        console.log(error);
    });   
});

app.get("/products/:params",(req,res)=>{
    axios.get(`http://localhost:3000/category/${req.params["params"]}`)
    .then(response => {
        let data="";
        response.data.forEach(element => {  
            data+=`
            <div class="article">
                <div class="box">
                    <h2>${element.name}</h2>
                    <p class="category">${element.category}</p>
                    <p class="price">${element.price} RSD</p>
            `;
            if(element.discounts.price != "")
            {
                data+=`
                <p class="discount">${element.discounts.price} RSD</p>`;
            }
            data+=`<p class="tags">`;
            for(let i=0;i<5;i++)
            {
                if(element.tags[i] != "")
                {
                    data+=`#${element.tags[i]} `;
                }
            }
            data+=`</p>`;
            data+=`
                </div>
                <div class="row">
                    <a href="/delete/${element.id}"><div id="delete" class="button">Obriši</div></a>
                    <a href="/edit/${element.id}"><div id="edit" class="button">Uredi</div></a>
                </div>
            </div>
            `;
        });
        let category="";
        res.send(readView("products").replace("#{data}",data).replace("#{category}",category));
    })
    .catch(error => {
        console.log(error);
    });   
});

// edit product
app.get("/edit/:id",(req,res)=>{
    axios.get('http://localhost:3000/products')
    .then(response => {
        let data="";
        response.data.forEach(element => {
        if(element.id == req.params["id"])
        {data=`
            <form action="/update/${element.id}" method="post">
            <input type="text" placeholder="name" name="name" value="${element.name}">
            <br>
            <input type="text" placeholder="category" name="category" value="${element.category}">
            <br>
            <input type="text" placeholder="price" name="price" value="${element.price}">
            <br>
            <input type="text" placeholder="tag1" name="tag1" value="${element.tags[0]}">
            <br>
            <input type="text" placeholder="tag2" name="tag2" value="${element.tags[1]}">
            <br>
            <input type="text" placeholder="tag3" name="tag3" value="${element.tags[2]}">
            <br>
            <input type="text" placeholder="tag4" name="tag4" value="${element.tags[3]}">
            <br>
            <input type="text" placeholder="tag5" name="tag5" value="${element.tags[4]}">
            <br>
            <input type="text" placeholder="Price on discount" name="priceDisc" value="${element.discounts.price}">
            <br>
            <input type="text" placeholder="Date till discount is on" name="dateDisc" value="${element.discounts.date}">
            <br>
            <button type="submit">UPDATE PRODUCT</button>
            </form>`;
        }
        });
        
        res.send(readView("update").replace("${data}",data));
    })
    .catch(error => {
        console.log(error);
    });   
});

// delete a product
app.get("/delete/:id",(req,res)=>{
    axios.delete(`http://localhost:3000/delete/${req.params["id"]}`)
    res.redirect("/products");
});

// add new product
app.post("/saveproduct",(req,res)=>{
    axios.post("http://localhost:3000/addproduct",{
        name:req.body.name,
        category:req.body.category,
        price:req.body.price,
        tags:
        [
            req.body.tag1,
            req.body.tag2,
            req.body.tag3,
            req.body.tag4,
            req.body.tag5,
        ],
        discounts:
        {
            price: req.body.priceDisc,
            date: req.body.dateDisc
        }
    })
    res.redirect("/products");
})

// update product
app.post("/update/:id",(req,res)=>{
    axios.post(`http://localhost:3000/update/${req.params["id"]}`,{
        name:req.body.name,
        category:req.body.category,
        price:req.body.price,
        tags:
        [
            req.body.tag1,
            req.body.tag2,
            req.body.tag3,
            req.body.tag4,
            req.body.tag5,
        ],
        discounts:
        {
            price: req.body.priceDisc,
            date: req.body.dateDisc
        }
    })
    res.redirect("/products");
});

// server up
app.listen(port,()=>
{
    console.log(`App started on ${port}`)
});