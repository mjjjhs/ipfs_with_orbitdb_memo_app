const ipfsClient = require('ipfs-http-client');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'files/'});
const express = require('express');
const router = express.Router();
const fileType = require('file-type');
require('dotenv').config();

//Connceting to the ipfs network via infura gateway
const ipfs = ipfsClient(process.env.IPFS_GATEWAY_URL, process.env.IPFS_GATEWAY_PORT, {protocol: process.env.IPFS_GATEWAY_PROTOCOL});


//Addfile router for adding file a local file to the IPFS network without any local node
router.post('/addFile', upload.single('imagesFile'), (req, res) => {
  try{
    console.log('addFile API req::',req.file);
    //Reading file from computer
    let testFile = fs.readFileSync(req.file.path);
    const regex = /^(.*\.((png|jpeg|jpg|gif)$))?[^.]*$/i;
    if(!regex.test(`.${fileType(testFile).ext}`)) {
      fs.unlinkSync(req.file.path);
      return res.status(200).json({result:400, message: 'FILE_TYPE_ERROR'});
    }
    //Creating buffer for ipfs function to add file to the system
    let testBuffer = new Buffer.from(testFile);
    // res.status(200).json({result:true, data: testBuffer});
    // return;
    ipfs.add(testBuffer, (err, file) => {
      console.log('ipfs add::', file);
      fs.unlinkSync(req.file.path);
      if (err) {
        return res.status(200).json({result:400, message: 'IPFS_ADD_ERROR'});
      }
      const validCID = file[0].hash;
      console.log('validCID::', validCID);
      ipfs.get(validCID, (err, files) => {
        files.forEach((file) => {
          console.log('ipfs file path::', file.path);
          const data = {
            src: file.content.toString('base64'),
            hash: file.path
          }
          return res.status(200).json({result:200, message:'OK', data});
        });
      });
    });
  } catch (e) {
    return res.status( ).json({result:400, message: 'IPFS_ADD_ERROR'});
  }
});
router.get('/getFile/:CID', (req, res) => {
  try {
    console.log('getFile API req::',req.params);
    const cid = req.params.CID;
    ipfs.get(cid, (err, files) => {
      if (err) {
        return res.status(200).json({result:400, message: 'IPFS_GET_ERROR'});
      }
      files.forEach((file) => {
        console.log('ipfs file path::', file.path, file.content);
        // console.log(file.content.toString('utf8'));
        const data = {
          src: file.content.toString('base64'),
          hash: file.path
        };
        // const data = {};
        return res.status(200).json({result:200, message:'OK', data});
      });
    });
  } catch (e) {
    return res.status(400).json({result:400, message: 'IPFS_GET_ERROR'});
  }
});

module.exports = router;
