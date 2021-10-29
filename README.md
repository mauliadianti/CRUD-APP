# CRUD-APP

i'm using Express JS and PostgreSQL for this project

Guideline to use API Product
1. Copy this bearer Token to Authentication 'c73b6aab9952796bf8ea14f6e3b886dfa0f0599c57f31afc4c6d5a1dd9043030428d279fe4fb7591aa062e20f834a671cf57a032c554fe96c256534fbc12af35' without ''
2. To use the authentication 
- Authorization 
- Type: Bearer Token
3. Working with API 
- Insert New Product 
>methods = [POST] 
>url= http://127.0.0.1:3000/products_insert
```
go to Body 
form-data
```

``key:value``
``name : productName ``
``qty  : productQty ``
``price: productPrice ``
``photo: (change the type from text to file, and you ready to go to upload your photo)``

- Read Product
>methods = [GET] 
>url = http://127.0.0.1:3000/products (to read all products list) 
>url = http://127.0.0.1:3000/products/:products_id (to read products by products_id) 
!products_id is auto generate by the sistem, you can't manually input the products_id or passing some new products_id or even change the products_id this is the unique one


- Update Products 
>methods = [PUT] 
>url = http://127.0.0.1:3000/products_update/:products_id 
>go to Body
>raw 
>choose JSON format 
name, qty, price (choose this one as key bellow) 
{
"key" : "yourValue" 
}
>url = http://127.0.0.1:3000/photo_update/:products_id 
>go to Body 
>form-data
key:value
photo: (change the type from text to file, and you ready to go to upload your photo)

 	
- Delete Products 
>methods = [DELETE] 
>url= http://127.0.0.1:3000/products_delete/:products_id



callbacks: 
``for(post, put and delete) if everything succes there will be a reply {"message" : "OK"}``
``for(get) the result is what you find for, if you try to search a products by their products_id but it doesn't registered before in the database, the reply will {"error" : "No data"}``
``for Wrong Token (in case you miss one number or other, there will be a reply {"error" : "Wrong Token"}``
