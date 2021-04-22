const fs = require('fs');
const PATH="products.json";

let saveProducts = (data) => 
{
    fs.writeFileSync(PATH,JSON.stringify(data,null,2));
};

let readProducts = () => 
{
    let products =
    fs.readFileSync(PATH, (err, data) => {
        if (err) throw err;
            return data;
    });
    return JSON.parse(products);
};

exports.getProducts = () =>
{
    return readProducts();
};

exports.addProduct = (product) => {
    let id=1;
    let products=readProducts();
    if(products.length>0)
    {
        id=products[products.length-1].id+1;
    }
    product.id=id;
    products.push(product);
    saveProducts(products);
}

exports.updateProduct = (id, product) => {
    let products=readProducts();
    for (let i = 0; i < products.length; i++) {
        if(id == products[i].id)
        {
            product.id = parseInt(id);
            products[i] = product;
        }
    }
    saveProducts(products)
}

exports.deleteProduct = (id) => {
    saveProducts(readProducts().filter(product=>product.id!=id));
}

exports.getCategory = (category) =>{
    return readProducts().filter(product=>product.category==category);
}