app.filter('ellipsis', function(){
  return function(input, number){
    input = input || '';
    if (input.length > number) {
      var sliced = input.slice(0, number);
      var ellipsis = '...'
    } else {
      return input;
    };
    return sliced + ellipsis;
  };
});
