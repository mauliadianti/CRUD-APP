const crypto = require('crypto')
const dotenv = require('dotenv')
dotenv.config()
const {img,setupImg} = require('./photo.js')
const db = require('./db')

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'crud_user',
  password: 'dian367',
  port: 5432,
})

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// })

function Token(req){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(process.env.TOKEN === token) return 1
  else return 0
}

class products{
  //CREATE PRODUCT + UPLOAD PHOTO
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
    
            const result = await pool
              .query('INSERT INTO products (products_id, name, qty, price, photo) VALUES ($1, $2, $3, $4, $5)', [products_id, name, qty, price, photo])
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
  
  //READ ALL PRODUCT LISTED 
  async getProducts (req, res){
    try{
      if(Token(req)){
        const result = await db.query('SELECT * FROM products')
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

  //READ PRODUCT BY ID
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
  
  //UPDATE PRODUCT
  async updateProducts (req, res){
    try{
      if(Token(req)){
        const products_id = req.params.products_id
        const value = req.body 
        for (const key in value){
          const result = await pool.query(`UPDATE products SET ${key}=$1 WHERE products_id = $2`, [`${value[key]}`, products_id])
          res.send({message: 'OK'})
        }
      }else{
        res.send({error: 'Wrong Token'})
      }
    }catch(err){
      res.send({error: 'Server Error' + err})
    }
  }

  //DELETE PRODUCT BY ID
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

  //UPDATE A PHOTO
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