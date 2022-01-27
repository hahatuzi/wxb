
'use strict'

let watermark = {}

let setWatermark = (str) => {
  let id = '1.23452384164.123412415'

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }

  let can = document.createElement('canvas')
  can.width = 300
  can.height = 150

  let cans = can.getContext('2d')
  cans.rotate(-45 * Math.PI / 180)
  // cans.fillRect(0,0,250,200);

  cans.font = '20px Vedana'
  cans.fillStyle = 'rgba(200, 200, 200, 0.70)'
  cans.textAlign = 'left'
  cans.textBaseline = 'middle'
  cans.textShadow = "1px 1px 3px #f00";

  if(str != ''){
    cans.fillText(str.split('-')[0], 0, can.height / 5 * 4);
    cans.fillText(str.split('-')[1], 0,can.height);
  }
  // cans.fillText('报送某某某',0, can.height / 5 * 4)
  // cans.fillText('13822223333',0,can.height)







  let div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '80px'
  div.style.left =  '200px'
  div.style.position = 'absolute'
  div.style.zIndex = '-1'
  div.style.width = 'calc(100vw - 220px)'
  div.style.height = 100 + 'vh'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  document.body.appendChild(div)
  return id
}

// 该方法只允许调用一次
watermark.set = (str) => {
  let id = setWatermark(str)
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str)
    }
  }, 500)
  window.onresize = () => {
    setWatermark(str)
  }
}

watermark.clear = () => {
  let id = '1.23452384164.123412415';
  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }
}

export default watermark
