const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  }, 
  filename: (req, file, cb)=>{
    cb(null, new Date().getTime() + '-'+ file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'){
    cb(null, true);
  }
  else{
    cb(null, false);
  }
}

const img = multer({storage:fileStorage, fileFilter:fileFilter}).single('photo')
const setupImg = multer

module.exports={img, setupImg}