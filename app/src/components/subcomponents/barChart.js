import * as d3 from "d3";
import { axisLeft } from "d3";


export class barChart {
	constructor (ref, width, height, margin, methods){
		this.dom = ref.current;
		this.dom.innerHTML = '';
		this.width = width;
		this.height = height;
		this.margin = margin;
		this.methods = methods;

		this.svg = d3.select(this.dom)
								 .attr("id", "barchart")
								 .attr("width", width + margin * 2)
								 .attr("height", height + margin * 3)
								 .append("g")
								 .attr("transform", "translate(20, 20)");

		this.rectSvg = this.svg.append("g").attr("id", "rectSvg");
		this.textSvg = this.svg.append("g");
		this.axisSvg = this.svg.append("g");

		this.color = d3.scaleOrdinal(d3.schemeDark2);
		
	}

	initialize(values) {

		const scale = d3.scaleLinear().range([0, this.height]).domain([0, d3.max(values)])
		const scaleRevert = d3.scaleLinear().range([this.height, 0]).domain([0, d3.max(values)])
		
		const barMargin = this.margin * 0.5;
		const barWidth = (this.width- barMargin * (values.length + 1)) / values.length 
		
		this.rectSvg.selectAll("rect")
				        .data(values)
								.enter()
								.append("rect")
								.attr("id", (d, i) => this.methods[i] + "rect")
								.attr("width", barWidth)
								.attr("height", d => scale(d))
								.attr("transform", (d, i) => "translate(" + (i * (barWidth + barMargin) + barMargin) + ", "  + (this.height - scale(d)) + ")")
								.attr("fill", (d, i) => this.color(i))

		this.textSvg.selectAll("text")
								.data(this.methods)
								.enter()
								.append("text")
								.attr("x", (d,i) => i * (barWidth + barMargin) + barMargin + barWidth * 0.5)
								.attr("y", (d,i) => (this.height - scale(values[i]) - 8))
								.attr("text-anchor", "middle")
								.text(d => d.length > 4 ? d.slice(0, 4) : d)
								.style("font-size", "10px")
		
		this.axisSvg.call(d3.axisLeft(scaleRevert).ticks(5));
	}

	update(values, duration) {

		const scale = d3.scaleLinear().range([0, this.height]).domain([0, d3.max(values)])
		const scaleRevert = d3.scaleLinear().range([this.height, 0]).domain([0, d3.max(values)])
		const barMargin = this.margin * 0.5;
		const barWidth = (this.width- barMargin * (values.length + 1)) / values.length ;

		this.rectSvg.selectAll("rect")
							  .data(values)
								.join(
									enter => {
										enter.append("rect")
										     .attr("width", barWidth)
												 .attr("height", 0)
												 .attr("transform", (d, i) => "translate(" + (i * (barWidth + barMargin) + barMargin) + ", "  + (this.height - scale(d)) + ")")
											   .attr("fill", (d, i) => this.color(i))
												 .transition()
												 .duration(duration)
												 .attr("height", d => scale(d));
									},
									update => {
										update.transition()
													.duration(duration)
													.attr("height", d => scale(d))
													.attr("transform", (d, i) => "translate(" + (i * (barWidth + barMargin) + barMargin) + ", "  + (this.height - scale(d)) + ")")
									},
									exit => {
										exit.transition()
												.duration(duration)
												.attr("height", 0)
												.attr("transform", (d, i) => "translate(" + (i * (barWidth + barMargin) + barMargin) + ", "  + (this.height ) + ")")
												.remove()
									}
								);
		this.textSvg.selectAll("text")
								.data(this.methods)
								.join(
									enter => {
										enter.append("text")
													.attr("x", (d,i) =>  (i * (barWidth + barMargin) + barMargin + barWidth * 0.5))
													.attr("y", (d,i) => (this.height - scale(values[i]) - 8))
													.attr("text-anchor", "left")
													.text(d => d.length > 4 ? d.slice(0, 4) : d)
													.style("font-size", "10px")
													.style("opacity", 0)
													.transition()
													.duration(duration)
													.style("opacity", 1);
									},
									update => {
										update.transition()
												  .duration(duration)
													.attr("x", (d,i) => (i * (barWidth + barMargin) + barMargin + barWidth * 0.5))
													.attr("y", (d,i) => (this.height - scale(values[i]) - 8))
													.attr("text-anchor", "middle")
													.text(d => d.length > 4 ? d.slice(0, 4) : d)
									},
									exit => {
										exit.transition().duration(duration).style("opacity", 0).remove();
									}
								);

		this.axisSvg.transition().duration(duration).call(axisLeft(scaleRevert).ticks(5));



		
	}
}