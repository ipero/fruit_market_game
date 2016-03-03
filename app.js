// global fruits array which holds objects of fruits
var fruits = [];

function Fruit (name, price, averagePrice, inventory, className){
  this.name = name;
  this.price = price;
  this.averagePrice = averagePrice;
  this.inventory = inventory;
  this.className = className;
  fruits.push(this);
}

var randomInitialPrice = function() {
  return randomNumber(50, 999);

}
//global variables
var apple = new Fruit("Apples", randomInitialPrice(), [], 0, "apple");
var banana = new Fruit("Bananas", randomInitialPrice(), [], 0, "banana");
var orange = new Fruit("Oranges", randomInitialPrice(), [], 0, "orange");
var grape = new Fruit("Grapes", randomInitialPrice(), [], 0, "grape");
var pear = new Fruit("Pears", randomInitialPrice(), [], 0, "pear");
var watermelon = new Fruit("Watermelons", randomInitialPrice(), [], 0, "watermelon");

var counter = 0;// This will count each interval of gameplay.
var timer;// This will be set to a setInterval frequency of price updates.
var cash = 10000;//This is the amount of money, initially, that the user has; in pennies.
var MAX_GAME_CYCLES = 20;// A constant that limits the amount cycle of price updates.
var clockTimer;// This displays a clock for the user to know how much time of gameplay is left.


//This begins the game, starts the clock, and displays a random price.
function beginGame() {
  timer = setInterval(priceUpdate, 15000);
  displayClock();
  priceUpdate();
}

//This allows the user to reset the game and begin again.
function tryAgain () {
  $(".blur").removeClass("blur");
  $(".message").hide();
  for(var i = 0; i < fruits.length; i++){
    fruits[i].averagePrice = [];
    $('.' + fruits[i].className+'-expense').html(0);
  }
  cash = 10000;
  counter = 0;
  $('.bank').html('100.00')
  beginGame();
}

// Get random number function
function randomNumber(min, max){
  return Math.floor(Math.random() * (1 + max - min) + min);
}

//Primary function. Updates price every 15 seconds and stops at 5 minutes.
function priceUpdate() {

  if (counter == MAX_GAME_CYCLES) { //<- Once game time-limit is reached sell all fruit and update DOM.
    for(i = 0; i < fruits.length; i++){
      if(fruits[i].inventory > 0){
        var fireSale = 0;
        fireSale = fruits[i].inventory * fruits[i].price;
        fruits[i].inventory = 0;
        $('.' + fruits[i].className + '-inventory').html(fruits[i].inventory);
        cash += fireSale;
      }
    }
    $('.bank').html((cash / 100).toFixed(2));
    clearInterval(timer);
    clearInterval(clockTimer);
    $(".main").addClass("blur");
    $('.alert-message').html("You earned: $" + ((cash - 10000) / 100).toFixed(2));
    $('.message').show();
  }
//
  for(var i = 0; i < fruits.length; i++){
    var priceUpdate = 0;
    var priceUpdate = randomNumber(-50, 50);
    fruits[i].price = fruits[i].price + priceUpdate;
    if(fruits[i].price >= 1000){
      fruits[i].price -= 49;
    }
    else if (fruits[i].price < 50) {
      fruits[i].price += 49;
    }
    $('.'+fruits[i].className + '-price').text((fruits[i].price / 100).toFixed(2));
  }
  counter++;

}

function displayClock(){
  var timeLeft = 300;
  clockTimer = setInterval(function(){
      timeLeft--;
      var minutes = parseInt(timeLeft / 60);
      var seconds = parseInt(timeLeft % 60);
      if (seconds < 10){
        seconds = "0" + seconds;
      }
      $('.timer').text("Time left: " + minutes + ":" + seconds);
  }, 1000);
}

//buy funciton
function buy(){
   var myClass = $(this).data('classname');
   for (var i = 0; i < fruits.length; i++){
     if (myClass == fruits[i].className && cash >= fruits[i].price){

       cash -= fruits[i].price;
       fruits[i].inventory++;
       $('.' + fruits[i].className + '-inventory').html(fruits[i].inventory);
       $('.bank').html((cash / 100).toFixed(2));

       fruits[i].averagePrice.push(fruits[i].price);
       $('.' + fruits[i].className + '-expense').html('$' + Math.round(calcAverage(fruits[i].averagePrice) ) / 100);

      }
   }
}

// fuction to calculate average purchase price per fruit
function calcAverage(array){
  var sum = 0;
  for(var j = 0; j < array.length; j++){
    sum += parseInt(array[j]);
  }
  return sum / array.length;
}

//sell funciton
function sell() {
  var myClass = $(this).data('classname');
  console.log(myClass);
  for ( var i = 0; i < fruits.length; i++){
    if (myClass == fruits[i].className && fruits[i].inventory > 0){
      cash += fruits[i].price;
      fruits[i].inventory--;
      $('.' + fruits[i].className + '-inventory').html(fruits[i].inventory);
      $('.bank').html((cash / 100).toFixed(2));
     }
  }
}


$(document).ready(function() {

  $('.start').on('click', beginGame);

  $('.apple-buy').on('click', buy);
  $('.orange-buy').on('click', buy);
  $('.banana-buy').on('click', buy);
  $('.pear-buy').on('click', buy);

  $('.apple-sell').on('click', sell);
  $('.orange-sell').on('click', sell);
  $('.banana-sell').on('click', sell);
  $('.pear-sell').on('click', sell);

  $('.start-over-button').on('click', tryAgain);
});
