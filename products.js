const crypto = require('crypto')
const dotenv = require('dotenv')
dotenv.config()
const {img,setupImg} = require('./photo.js')

const Pool = require('pg').Pool

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
//   port: parseInt(process.env.DB_PORT, 10),
// })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

function Token(req){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(process.env.TOKEN === token) return 1
  else return 0
}

class products{
  async insertNewProducts (req, res){
    try{
      if(Token(req)){
        img(req, res, async err => {
          if (err instanceof setupImg.MulterError) res.send({error: err})
          else {
            if(!req.file){
              res.send({error: "Wrong file extension"})
              return
            }
            const products_id = crypto.randomBytes(15).toString('hex')
            const {name, qty, price} = req.body
            const photo = req.file.path
    
            const result = await pool.query('INSERT INTO products (products_id, name, qty, price, photo) VALUES ($1, $2, $3, $4, $5)', [products_id, name, qty, price, photo])
              res.send({message: 'OK'})
          }
        })        
      }else{
        res.send({error: 'Wrong Token'})
      }
    }catch(err){
      res.send({error: 'Server Error' + err})
    }
  }
  
  async getProducts (req, res){
    try{
      if(Token(req)){
        const result = await pool.query('SELECT * FROM products')
         if(result.rowCount === 0) res.send({error: 'No data'}) 
         else{
          res.send({message: result.rows})
         }
      }else{
        res.send({error: 'Wrong Token'})
      }
    }catch(err){
      res.send({error: 'Server Error' + err})
    }
  }

  async getProductsById (req, res){
    try{
      if(Token(req)){
        const products_id = req.params.products_id

        const result = await pool.query(`SELECT * FROM products WHERE products_id = $1`, [products_id])
          if(result.rowCount === 0) res.send({error: 'No data'}) 
          else{
          res.send({message: result.rows})
          }
      }
      else{
        res.send({error: 'Wrong Token'})
      }
    }catch(err){
      res.send({error: 'Server Error' + err})
    }
  }
  
  async updateProducts (req, res){
    try{
      if(Token(req)){
        const products_id = req.params.products_id
        const value = req.body 

        if(value['name']){
          const result = await pool.query(`UPDATE products SET name=$1 WHERE products_id = $2`, [value['name'], products_id])
          res.send({message: 'OK'})
        }else if(value['qty']){
          const result = await pool.query(`UPDATE products SET qty=$1 WHERE products_id = $2`, [value['qty'], products_id])
          res.send({message: 'OK'})
        }else if(value['price']){
          const result = await pool.query(`UPDATE products SET price=$1 WHERE products_id = $2`, [value['price'], products_id])
          res.send({message: 'OK'})
        }
      }else{
        res.send({error: 'Wrong Token'})
      }
    }catch(err){
      res.send({error: 'Server Error' + err})
    }
  }

  async deleteProducts (req, res){
    try{
      if(Token(req)){
        const products_id = req.params.products_id

        const result = await pool.query('DELETE FROM products WHERE products_id=$1', [products_id])
          res.send({message: 'OK'})
      }else{
        res.send({error: 'Wrong Token'})
      }
    }catch(err){
      res.send({error: 'Server Error' + err})
    }
  }

  photo(req,res){
    try{
      if(Token(req)){        
        img(req, res, async err => {
          if (err instanceof setupImg.MulterError) res.send({error: err})
          else {
            if(!req.file){
              res.send({error: "Wrong file extension"})
              return
            }
            const photo = req.file.path 
            const products_id = req.params.products_id

            const result = await pool.query('UPDATE products SET photo=$1 WHERE products_id = $2', [photo, products_id])
              res.send({message: 'OK'})            
          }
        })        
      }else{
        res.send({error: 'Wrong Token'})
      }  }
    catch(err){
      res.send({error: 'Server Error' + err})
    }
  }

}


module.exports = products