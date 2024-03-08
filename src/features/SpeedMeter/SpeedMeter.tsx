import * as d3 from "d3";
import {useEffect, useRef, useState} from "react";

import atcChime from "../../assets/audio/atc.mp3";


const SpeedMeter = () => {
  // SVGの幅
  const width = 400;
  const height = 400;
  
  const p = Math.PI;
  const startAngleRate = -1.4;
  const endAngleRate = 1.4;
  
  const svgRef = useRef<SVGSVGElement>(null!);
  
  // メーターの範囲を設定
  const arcScale = d3.scaleLinear()
    .domain([0, 150])
    .range([startAngleRate * 90, endAngleRate * 90]); // ここは度
  
  useEffect(() => {
    const svg = d3.select(svgRef.current)
    const translated = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);
    
    const arc = d3.arc()
      .innerRadius(55)
      .outerRadius(60)
      .startAngle(startAngleRate * p / 2) // ここはラジアン
      .endAngle(endAngleRate * p / 2);
    
    // メーターバー部分の追加
    translated.append("path")
      .attr("d", arc as never)
    
    // メーターの針の追加
    // var linePath = translated.append("line")
    //   .attr("x1", 0)
    //   .attr("x2", 0)
    //   .attr("y1", 0)
    //   .attr("y2", -45)
    //   .attr("stroke", "black")
    //   .attr("stroke-width", 3)
    //   .attr("transform", `rotate(${arcScale(0)})`); // 初期位置は0
    
    translated.append("path")
      .attr("id", "line")
      .attr("d", "m0,-65 l-5,-10 h10 Z")
      .attr("fill", "#f00")
      .attr("transform", `rotate(${arcScale(0)})`)
    
    // 目盛の追加
    // 0 を100個の5間隔で配列を作成
    const ticks = d3.range(0, 155, 5);
    // グループ要素を目盛数分追加する
    const ticks_g = svg.selectAll(".tick").data(ticks).enter()
      .append("g")
      .attr("class", "tick")
      .attr("transform", () => `translate(${width / 2},${height / 2})`);
    // 移動と回転を同時にする場合はこっち
    // .attr("transform", d => `translate(${width / 2},${height / 2})rotate(${arcScale(d)})`);
    
    
    // 目盛りの線
    const ticksLine = d3.line()
      .x(0)
      .y(d => d[1]);
    
    // 目盛りの追加
    ticks_g.append("path")
      .attr("d", d => d % 20 === 0 ? ticksLine([[0, -50], [0, -45]]) : ticksLine([[0, -50], [0, -48]]))// 補助目盛
      .attr("stroke", "gray")
      .attr("stroke-width", 2)
      .attr("stroke-linecap", "round")
      .attr("transform", datum => `rotate(${arcScale(datum)})`);
    
    // ラベル 位置は角度から(x,y)を求めて、貼り付け
    ticks_g.append("text")
      .attr("x", d => 32 * Math.sin(arcScale(d) * (Math.PI / 180)))
      .attr("y", d => -32 * Math.cos(arcScale(d) * (Math.PI / 180)) + 2)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .attr("font-size", "14px")
      .attr("font-family", "sans-serif")
      .text(datum => datum % 20 === 0 ? datum : null);
    
    /*const digitalMeter =*/
    svg.append("text")
      .attr("id", "digitalMeter")
      .attr("x", width / 2)
      .attr("y", height / 2 + 40)
      .text(speed)
  }, []);
  
  const [speed, setSpeed] = useState(0);
  const [preSpeed, setPreSpeed] = useState(0);
  
  const audio = new Audio(atcChime);
  
  useEffect(() => {
    // 針の動作アニメーション 以前の値⇒更新後の値へ針を動かす
    const t = d3.transition().duration(0);
    d3.select("#line").transition(t)
      .attrTween("transform", () => d3.interpolateString(`rotate(${arcScale(preSpeed)})`, `rotate(${arcScale(speed)})`));
    d3.select("#digitalMeter")
      .text(speed)
    
    setPreSpeed(speed)
  }, [speed])
  
  const handleSpeedChange = (newSpeed: number) => {
    audio.play().catch(error => console.warn(error));
    setSpeed(newSpeed);
  };
  
  return (
    <>
      <svg width={width} height={height} ref={svgRef}/>
      <label>指示速度:
        <select onChange={event => handleSpeedChange(Number(event.target.value))}>
          {[...Array(13)].map((_, index) => <option key={index}>{index * 10}</option>)}
        </select>
      </label>
    </>
  );
}

export default SpeedMeter;