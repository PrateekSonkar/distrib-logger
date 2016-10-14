var helper = {};

helper.composeDoc = function(doc,cb){
  console.log("Into helper composeDoc : " + JSON.stringify(doc));
  doc.createdAt = new Date().getTime();
  doc.addedBy = '';// to be added later
  cb(doc);
}

module.exports = helper;
