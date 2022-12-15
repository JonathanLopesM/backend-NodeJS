
import multer from  'multer';
import path from 'path'

export const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve("uploads"))
  },
  filename: (req, file, callback)=> {
    const time = new Date().getTime();
    const id = req.params

    callback(null, `${time}_${file.originalname}`)
  },
  
})

export const limits ={
  fileSize :  2 * 1024 * 1024
}

export const fileFilter = (re, file, callback) => {
  const allowedMines = [
    'file/pdf'
  ]
}