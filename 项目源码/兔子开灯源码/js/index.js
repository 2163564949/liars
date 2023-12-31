const $body = $('body');
const $eye = $('.eye');
const $pupil = $('.pupil');
const $switchWrapper = $('.switch-wrapper');
const $animalBody = $('#animal-body');


const swing = () => {
  $switchWrapper.addClass('swing');

  setTimeout(() => {
    $switchWrapper.removeClass('swing');
  }, 1000);
};

const randomAnimal = () => {
  let arr = ['img/bear_wgyw8f.png','img/bunny_kpofl4.png'];
  return arr[Math.floor(Math.random() * arr.length)];
};

$('.switch').on('click', () => {
  if ($body.hasClass('lightsOn')) {
    $body.removeClass('lightsOn').addClass('lightsOff');
    $pupil.removeClass('center');
    $animalBody.addClass('hide');

  } else {
    $('.lightsOff').find('.eye').css('transform', 'rotate(0deg)'); 
    $body.addClass('lightsOn').removeClass('lightsOff');
    $pupil.addClass('center');
    $animalBody.removeClass('hide').attr('src', randomAnimal());
  }

  swing();
});

$('.string').on('mouseenter', swing);


//以下代码引用了Codewoofy：https://codepen.io/Codewoofy/pen/VeBJEP
$body.mousemove(event => {
  event.preventDefault();
  let x = ($eye.offset().left) + ($eye.width() / 2);
  let y = ($eye.offset().top) + ($eye.height() / 2);
  let rad = Math.atan2(event.pageX - x, event.pageY - y);
  let rot = (rad * (180 / Math.PI) * -1) + 180;
  $('.lightsOff').find('.eye').css({'transform': 'rotate(' + rot + 'deg)'});
});