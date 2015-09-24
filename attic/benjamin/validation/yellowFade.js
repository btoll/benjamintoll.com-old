function yellowFade(elem, red, green, blue) {

  if (elem.fade) {
    clearTimeout(elem.fade);
  }

  elem.style.backgroundColor = "rgb(" + red + ", " + green + ", " + blue + ")";
  if (red == 255 && green == 255 && blue == 204) { return; }

  var newred = red + Math.ceil((255 - red) / 10);
  var newgreen = green + Math.ceil((255 - green) / 10);
  var newblue = blue + Math.ceil((204 - blue) / 10);
  var repeat = function() { yellowFade(elem, newred, newgreen, newblue); };

  elem.fade = setTimeout(repeat, 100);

}