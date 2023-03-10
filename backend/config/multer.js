import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    upload_preset: 'bakeryAppProduct',
    public_id: (req, file) => {
      const productData = JSON.parse(req.body.product);
      const name = productData.name;

      if (!name) {
        throw new Error('Please add a image name parameter');
      }

      return name.replace(/ /g, '_');
    }
  }
});

const upload = multer({ storage: storage });

export default upload;
