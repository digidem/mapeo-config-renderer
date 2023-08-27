const express = require('express');                                                                                                                                                                                                          
const router = express.Router();                                                                                                                                                                                                             
const path = require('path');                                                                                                                                                                                                                
                                                                                                                                                                                                                                             
router.get('/', (req, res, next) => {                                                                                                                                                                                                              
  res.sendFile(path.join(__dirname, "..", "build", "index.html"), function(err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', path.join(__dirname, "..", "build", "index.html"));
    }
  });                                                                                                                                                                                                                                          
});                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                             
module.exports = router;                                                                                                                                                                                                                     
