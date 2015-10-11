$(document).ready(init);

function test(data) {
  if (data.RESULTS[0]){
    var theCity = data.RESULTS[0].name;
    var locIdentifier = data.RESULTS[0].zmw;

    console.log(locIdentifier);
    $.get('http://api.wunderground.com/api/dca680da44d3f5a3/forecast/q/zmw:' + locIdentifier + '.json', function(data){
      console.log(data);
      var arrOfDayObjects = [];
      var dayForecast = data.forecast.txt_forecast.forecastday;
      var extraInfo = data.forecast.simpleforecast.forecastday;

      console.log(extraInfo)
      for (var i = 0; i <= 6 ; i+=2){
        dayForecast[i].icon_url = dayForecast[i].icon_url.replace(/\/i\/c\/k/,'/i/c/f');
        dayForecast[i].conditions = extraInfo[i/2].conditions;
        dayForecast[i].avehumidity = extraInfo[i/2].avehumidity;
        dayForecast[i].high = extraInfo[i/2].high;
        dayForecast[i].low = extraInfo[i/2].low;
        arrOfDayObjects.push(dayForecast[i]);
      }

      var dayArray = [];
      var preparedData = arrOfDayObjects.forEach(function(toInsert, i){
        if(i === 0){toInsert.title = 'Today'}
          if(i === 1){toInsert.title = 'Tomorrow'}
        dayArray.push({
          title: "<h3>"+toInsert.title+"</h3>",
          image: "<img src="+toInsert.icon_url +"></img>",
          cond: "<h4>"+ toInsert.conditions+"</h4>",
          summary: "<p>"+ toInsert.fcttext+ "</p>",
          high: "<h4> High: " + toInsert.high.celsius + "&deg;C",
          low: "<h4> Low: " + toInsert.low.celsius + "&deg;C"
        })
      })

      // var finalDisplayBoard;
      var allDaysToDisplay = dayArray.map(function(obj){
        var full = '<div>';
        for( var details in obj){
          full = full+obj[details]
        }
        return full + "</div>";
      })
      for(var i = 0; i <= allDaysToDisplay.length; i ++){
        $('[data-id='+i+']').empty();
        $('[data-id='+i+']').append(allDaysToDisplay[i]);
      }
      $('.cityTitlePanel').empty();
      $('.cityTitlePanel').append('<h1 id="city">' + theCity + '</h1>')
      // $('.todayBox .heading').text('Today')

    })
  }else {
    for(var i = 0; i <= 3; i ++){
      $('[data-id='+i+']').empty();
    }
    $('.cityTitlePanel').empty();
    $('.cityTitlePanel').append('<h1 id="notFound">The location you entered could not be found, please try again</h1>')
  }
    $('.main').show();
}



function init(){

  $('#searchInput').keyup(function(){
    var keyCode = event.keyCode || event.which;   
    if (keyCode == 13) {
      $('#search').trigger('click');
    }
  })
  $('.main').hide();
  $.get('http://api.wunderground.com/api/dca680da44d3f5a3/geolookup/q/autoip.json', function(data){
    var stateOrCountry = data.location.country;
    $('#searchInput').val(data.location.city + ', ' + stateOrCountry)
  })

  $('#search').click(function(){
    var theSearch = $('#searchInput').val();
    var locationArr = theSearch.split(',')
    locationArr[1] = locationArr[1] ? locationArr[1].trim().toUpperCase() : null;
    var country = '';
    if (locationArr[1]){
      var country = '&c='+ locationArr[1];
    }
    
    $.ajax({
      url : 'http://autocomplete.wunderground.com/aq?query=' + locationArr[0] + country + '&format=JSON&cb=test',
      dataType : "jsonp",
      success : test
    });
})
  
}