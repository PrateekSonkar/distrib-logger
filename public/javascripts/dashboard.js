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

var prepareList = function(itemArray){
  console.log("preparing lits " + itemArray);
  if(itemArray.length > 0){
    for(arr = 0 ; arr < itemArray.length ; arr++){
      var row = "<li class='svrlist' rel="+itemArray[arr].sid+"><a rel=a-"+itemArray[arr].sid+" class='svrlist waves-effect waves-light btn'>"+itemArray[arr].sid+"</a></li>";
      $("#slide\\-out").append(row);
    }
    $("li.svrlist:first").addClass("selserver").children().addClass("disabled");
  } else {
    return;
  }
}

var getServerList = function(){
  var reqObj = {
    method:"GET",
    url:'/users/getservers'
  }
  new composeAjax(reqObj,function(data){
    console.log("getServerList : " + JSON.stringify(data));
    prepareList(data.servers);
  });
}

var changeServer = function(){
  $('.activeview');
  socket.emit('changeserver',{fromserver:"",toserver:""});
}

var addDelegate = function(){
  console.log("add delegate");
  $("li").delegate("click","a",function(){
    console.log("Delegate called : " + $(this).attr("rel"));
  });
}


var resetCpuChart = function(){
  var chartRef = $("#cpustats").highcharts();
  var sLength = chartRef.series.length;
  console.log('Container : ' + sLength)
  for(var i = sLength -1; i > -1; i--){
    console.log('value of i' + i);
    chartRef.series[i].remove(true);
  }
  chartRef.addSeries({
      name: 'System',
      data: []
  });
  chartRef.addSeries({
      name: 'Process',
      data: []
  });
}

var resetMemoryChart = function(){
  console.log('resetMemoryChart called');
  var chartRef = $("#memorystats").highcharts();
  var sLength = chartRef.series.length;
  console.log('Container : ' + sLength)
  for(var i = sLength -1; i > -1; i--){
    console.log('value of i' + i);
    chartRef.series[i].remove(true);
  }
  chartRef.addSeries({
      name: 'Physical Available',
      data: []
  });
  chartRef.addSeries({
      name: 'Physical Used',
      data: []
  });
  chartRef.addSeries({
      name: 'Physical Node',
      data: []
  });
  chartRef.addSeries({
      name: 'Virtual Node',
      data: []
  });
}

var resetGcChart  = function(){
  console.log('resetGcChart called');
  var chartRef = $("#gcstats").highcharts();
  var sLength = chartRef.series.length;
  console.log('Container : ' + sLength)
  for(var i = sLength -1; i > -1; i--){
    console.log('value of i' + i);
    chartRef.series[i].remove(true);
  }
  chartRef.addSeries({
      name: 'Available JS Heap',
      data: []
  });
  chartRef.addSeries({
      name: 'Used JS Heap',
      data: []
  });
}

var resetEvtChart = function(){
  var chartRef = $("#elstats").highcharts();
  var sLength = chartRef.series.length;
  console.log('Container : ' + sLength)
  for(var i = sLength -1; i > -1; i--){
    console.log('value of i' + i);
    chartRef.series[i].remove(true);
  }
  chartRef.addSeries({
      name: 'Minimum',
      data: []
  });
  chartRef.addSeries({
      name: 'Maximum',
      data: []
  });
  chartRef.addSeries({
      name: 'Average',
      data: []
  });
}

var resetLoChart = function(){
  var chartRef = $("#lstats").highcharts();
  var sLength = chartRef.series.length;
  console.log('Container : ' + sLength)
  for(var i = sLength -1; i > -1; i--){
    console.log('value of i' + i);
    chartRef.series[i].remove(true);
  }
  chartRef.addSeries({
      name: 'Shortest Tick',
      data: []
  });
  chartRef.addSeries({
      name: 'Longest Tick',
      data: []
  });
  chartRef.addSeries({
      name: 'Average Tick',
      data: []
  });

}
