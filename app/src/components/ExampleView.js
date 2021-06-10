import React, { useEffect } from 'react';
import * as d3 from "d3";

import { Scatterplot } from './subcomponents/scatterplot';
import "../css/mainview.css";

const ExampleView = (props) => {

	const methods = props.methods;	
	const pointNum = props.pointNum;
	const radius = 8;
	
	const exampleSize = props.height - props.margin * 2;
	const labelColors = props.labelColors;


	const labelData = require("../json/label.json");
	const exampleData = methods.map(d => { 
		const data = require("../json/" + d + ".json"); 
		const xMax = d3.max(data.map(d => d[0]));
		const xMin = d3.min(data.map(d => d[0]));
		const yMax = d3.max(data.map(d => d[1]));
		const yMin = d3.min(data.map(d => d[1]));
		const xScale = d3.scaleLinear().domain([xMin, xMax]).range([-0.9, 0.9]);
		const yScale = d3.scaleLinear().domain([yMin, yMax]).range([-0.9, 0.9]);
		return data.map(d => [xScale(d[0]), yScale(d[1])])
	});

	const colorData = labelData.map(idx => {
		const color = d3.rgb(labelColors(idx));
		return [color.r, color.g, color.b];
	});
	console.log(colorData)

	useEffect(() => {
		methods.forEach((method, i) => {
			const data = {
				position: exampleData[i],
				opacity: new Array(pointNum).fill(1),
				color: colorData,
				border: new Array(pointNum).fill(0),
				borderColor: new Array(pointNum).fill([0, 0, 0]),
				radius: new Array(pointNum).fill(radius),
			}
			const currentScatterplot = new Scatterplot(data, document.getElementById(method + "Canvas"));
		});
	}, [])




	return (
		<div 
			className="functionViews exampleView"
			style={{
				width: props.width,
				height: props.height,
				display: "flex"
			}}
		>
			{
				methods.map((d, i) => {

					return (
						<div key={i} style={{fontSize: "13px", margin: props.margin}}>
							<canvas
								id={d + "Canvas"}
								style={{
									width: exampleSize,
									height: exampleSize,
									border: "1px solid black"
								}}
								width={exampleSize * 2}
								height={exampleSize * 2}
							/>
							<div style={{position: "relative", top: "-20px", left: "5px"}}>
							{d}
							</div>
							
						</div>
					);
				})
			}
		</div>
	)
}

export default ExampleView;