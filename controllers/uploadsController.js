const {StatusCodes} = require('http-status-codes');
const {Product} = require('./../models/Product');
const path = require('path');
const {BadRequestError} = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadProductImageLocal = async (req, res) => {
  // check if the file exists
  if (!req.files) {
    throw new BadRequestError('No file provided');
  }

  const productImage = req.files.image;

  // check if it is an image
  if (!productImage.mimetype.startsWith('image')) {
    throw new BadRequestError('Please upload an image');
  }
  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new BadRequestError('Please upload an image smaller than 1MB');
  }

  const imagePath = path.join(
    __dirname,
    `../public/uploads/${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({
    image: {
      src: `/uploads/${productImage.name}`,
    },
  });
};

const uploadProductImage = async (req, res) => {
  tempFilePath = req.files.image.tempFilePath;
  const result = await cloudinary.uploader.upload(tempFilePath, {
    use_filename: true,
    folder: 'file-upload',
  });
  fs.unlinkSync(tempFilePath);
  res.status(StatusCodes.OK).json({
    image: {
      src: result.secure_url,
    },
  });
};

module.exports = {
  uploadProductImage,
};
