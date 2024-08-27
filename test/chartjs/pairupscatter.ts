const fs = require('fs');

function pairUpScatter(xAxis: number[], yAxis:number[]) {
  let pair: {x: number; y: number}
  let data: {x: number; y: number}[] = [];
  for (let i = 0; i < xAxis.length; i++) {
    pair = {x: xAxis[i], y: yAxis[i]}
    data.push(pair)
  }
  return data
}

let gpxFile = fs.readFileSync('gpxparsed.json')
gpxFile = JSON.parse(gpxFile)

let dist1 = gpxFile.distance.cumul;
let points = gpxFile.points;
let ele1 = points.map((point:any)=>point.ele)

export const eleProfile = pairUpScatter(dist1, ele1)
// console.log(eleProfile)