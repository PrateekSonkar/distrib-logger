var checkRange = function(number){
  return ( 0 <= number && number <= 255);
}

var validateIp = function(IP){
  var ip = IP.split(".");
  if(ip.length == 4){
    for(var ipLength = 0 ; ipLength < ip.length ; ipLength++){
      var condition = checkRange(ip[ipLength]);
      if (!condition) return false;
    }
  } else {
    return false;
  }
  return true;
}

var validatePortRange = function(port){
  return (0 <= port && port <= 65535);
}

var clearTextFields = function(){
  $(".clearField").each(function(){
    $(this).val("");
  });
}

var addItemToTable = function(itemArray){
  if(itemArray.length > 0){
    for(arr = 0 ; arr < itemArray.length ; arr++){
      var row = "<tr id="+itemArray[arr].sid+" rel="+itemArray[arr]._id+"><td>"+itemArray[arr].sid+"</td><td>"+itemArray[arr].ip+":"+itemArray[arr].port+"</td><td><i class='material-icons circle white'>info_outline</i></td></tr>";
      $("#tblsvrhealth").append(row);
    }
  } else {
    return;
  }
}


var composeAjax = function(options,cb){
  // this is how options should look like
  //{
  //   method: "POST",
  //   url: options.endPoint,
  //   data: options.data
  // }
  $.ajax(options).done(function(data){
    cb(data);
  });
}

var addServer = function(){
  if($.trim($('#svrid').val()) == ""){
    alert("One or more field are mandatory");
    return;
  }

  if(!validateIp($.trim($('#svrip').val()))){
    return;
  }

  if(!validatePortRange($.trim($('#svrport').val()))){
    return;
  }

  var reqObj = {
    method:"POST",
    url:'/users/addserver',
    data:{
      sid : $.trim($('#svrid').val()),
      ip : $.trim($('#svrip').val()),
      port : $.trim($('#svrport').val())
    }
  };
  new composeAjax(reqObj,function(data){
      if(data.status){
        console.log("Server added successfully in db : " + JSON.stringify(data));
        addItemToTable(data.servers.ops);
        clearTextFields();
      } else {
        console.log(data.info);
        clearTextFields();
      }
  });
}

var getAllServer = function(){
  var reqObj = {
    method:"GET",
    url:'/users/getservers'
  }
  new composeAjax(reqObj,function(data){
    console.log("getserver : " + JSON.stringify(data));
    addItemToTable(data.servers);
  });
}
