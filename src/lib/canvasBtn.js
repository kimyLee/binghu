/**
 * Created by Administrator on 2015/11/2 0002.
 */
/* canvas 按钮特效 */
export default {
  init ($target) {
    // let $target = document.querySelector(dom)
    let $canvas = document.createElement('canvas')
    $canvas.width = $target.offsetWidth
    $canvas.height = $target.offsetHeight
    $target.appendChild($canvas)
    $target.addEventListener('click', (ele) => {
      let target = ele.target || ele.srcElement
      console.log(target)
    })
  }
}
// $(function () {
//   window.requestAnimFrame = (function () {
//       return window.requestAnimationFrame ||
//           window.webkitRequestAnimationFrame ||
//           window.mozRequestAnimationFrame ||
//           function (callback) {
//               window.setTimeout(callback, 1000 / 60);
//           };
//   })();
//   var canvasBtn = {
//       canvas: {}
//       , centerX: 0
//       , centerY: 0
//       , color: ''
//       , containers: $('.btn_canvas')
//       , context: {}
//       , element: {}
//       , radius: 0
//       , max_radius: 0
//   };
//   var init = function () {
//       canvasBtn.containers.each(function () {
//           var $this = $(this);
//           var $canvas = $('<canvas width=' + $this.width() + ' height=' + $this.height() + '></canvas>');
//           $this.append($canvas);
//           $this.on("click", "canvas", function (e) {
//               press(e, this)
//           });

//       })

//   };

//   function press(event, target) {
//       var $this = $(target);
//       canvasBtn.color = $this.parent().data("color");
//       canvasBtn.context = $this.get(0).getContext("2d");
//       canvasBtn.radius = 0;
//       canvasBtn.centerX = event.pageX - $this.offset().left;
//       canvasBtn.centerY = event.pageY - $this.offset().top;
//       canvasBtn.context.clearRect(0, 0, $this.width(), $this.height());
//       canvasBtn.max_radius = $this.width();
//       console.log(canvasBtn.max_radius);
//       draw();
//   }

//   function draw() {
//       canvasBtn.context.beginPath();
//       canvasBtn.context.arc(canvasBtn.centerX, canvasBtn.centerY, canvasBtn.radius, 0, 2 * Math.PI, false);
//       canvasBtn.context.fillStyle = canvasBtn.color;
//       canvasBtn.context.fill();
//       canvasBtn.radius += 2;
//       if (canvasBtn.radius < canvasBtn.max_radius) {
//           window.requestAnimFrame(draw);
//       }

//   }

//   init();
// })
