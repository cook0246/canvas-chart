var canvas, context, data, pct, cheeseSource, cheese;
var total = 0;

document.addEventListener("DOMContentLoaded", function(){
    cheeseSource = $.ajax({
      url: "json/cheese.json",
      dataType: "JSON",
      type: "GET"
    });
    
    cheeseSource.done(function( data ) {
        for( var i = 0; i< data.segments.length; i++ ) {
            total += data.segments[i].value;
            cheese = data.segments;
        }
        console.log( "Success!" );
        console.log( cheeseSource );
        showPie();
        showNumbers();
    });
});

function setDefaultStyles(){
  //set default styles for canvas
  context.strokeStyle = "#333";	//colour of the lines
  context.lineWidth = 3;
  context.font = "10pt Arial";
  context.fillStyle = "#900";	//colour of the text
  context.textAlign = "center";
}


function showPie(){
  canvas = document.getElementById("chart1");
  context = canvas.getContext("2d");
    
  //clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
  //set the styles in case others have been set
  setDefaultStyles();
  var cx = (canvas.width/2) - 35;
  var cy = canvas.height/2;
  var radius = 100;
  var currentAngle = 0;
  //the difference for each wedge in the pie is arc along the circumference
  //we use the percentage to determine what percentage of the whole circle
  //the full circle is 2 * Math.PI radians long.
  //start at zero and travelling clockwise around the circle
  //start the center for each pie wedge
  //then draw a straight line out along the radius at the correct angle
  //then draw an arc from the current point along the circumference
  //stopping at the end of the percentage of the circumference
  //finally going back to the center point.
  for(var i=0; i < cheese.length; i++){
    pct = cheese[i].value/total;
    var theLabel = cheese[i].label;  
    var colour = cheese[i].color;
      
      if(cheese[i].value <= 4) {
          radius = 110;
      }else if(cheese[i].value >= 35){
          radius = 90;
      }else{
          radius = 100;
      }
    
   
    var endAngle = currentAngle + (pct * (Math.PI * 2));
    //draw the arc
    context.moveTo(cx, cy);
    context.beginPath();
    context.fillStyle = colour;
    context.arc(cx, cy, radius, currentAngle, endAngle, false);  
    context.lineTo(cx, cy);
    context.fill();
    
    
    //Now draw the lines that will point to the values
    context.save();
    context.translate(cx, cy);//make the middle of the circle the (0,0) point
    context.strokeStyle = "#0CF";
    context.lineWidth = 1;
    context.beginPath();
    //angle to be used for the lines
    var midAngle = (currentAngle + endAngle)/2;//middle of two angles
    context.moveTo(0,0);//this value is to start at the middle of the circle
    //to start further out...
    var dx = Math.cos(midAngle) * (0.8 * radius);
    var dy = Math.sin(midAngle) * (0.8 * radius);
    context.moveTo(dx, dy);
    //ending points for the lines
    var dx = Math.cos(midAngle) * (radius + 40); //35px beyond radius
    var dy = Math.sin(midAngle) * (radius + 40);
    context.lineTo(dx, dy);
    context.stroke();
    //put the canvas back to the original position
    context.fillText(theLabel, dx, dy);
    context.restore();
    //update the currentAngle
    currentAngle = endAngle;
  }  
}

function showNumbers(){
  canvas = document.getElementById("chart2");
  context = canvas.getContext("2d");
    //clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
  //set the styles in case others have been set
  setDefaultStyles();
  var xpos = 40;
  var ypos = 40;
  context.fillText( "Values", xpos, ypos);
  //1. write out the numbers
  for(var i=0; i<cheese.length; i++){
    ypos += 40;
    context.fillText( cheese[i].value.toString(), xpos, ypos);
  }
  //2. write out the total
  ypos += 40;
  context.fillText( total + " - total", xpos, ypos);
  
  //3. write out percentage of the total for each number
  ypos = 40;
  xpos += 250;
  context.fillText( "Percentage of total", xpos, ypos);
  for(var i=0; i<cheese.length; i++){
    ypos += 40;
    pct = (parseInt(cheese[i].value / total * 10000))/100;
    context.fillText( pct.toString(), xpos, ypos);
  }
  
  
  
}

       