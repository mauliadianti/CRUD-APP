const express = require('express')
const app = express()
const morgan = require('morgan')
const port = process.env.PORT || 3000
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()

app.use(
  morgan('dev'),
  express.json(), 
  express.urlencoded({
    extended: true,
  })
)

app.use('/assets', express.static(path.join(__dirname, 'assets/img')))

app.get('/', (req, res) => {
  res.json({"message": 'welcome home'})
})


const products = require('./products.js')
const Products = new products()
app.get('/products', Products.getProducts)
app.get('/products/:products_id', Products.getProductsById)
app.post('/products_insert', Products.insertNewProducts)
app.put('/products_update/:products_id', Products.updateProducts)
app.put('/photo_update/:products_id', Products.photo)
app.delete('/products_delete/:products_id', Products.deleteProducts)


app.listen(port, () => {
  console.log(`Api running in http://127.0.0.1:${port}`)
})