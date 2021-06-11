import * as d3 from "d3";
import  { deepcopyArr } from "../../helpers/utils";
import  { Scatterplot } from "./scatterplot";

export class CaptureViewManage {
	constructor(dom, pointNum, colorData) {
		this.dom = dom.current;
		this.latentValuesList = [[], [], []];
		this.embeddingList = [[], [], []];    // coordinates
		this.currentVisible = [false, false, false];
		
		const radius = 16;

		this.scatterplotList = [];
		for (let i = 0; i < 3; i++) {
			const data = {
				position: new Array(pointNum).fill([0, 0]),
				opacity: new Array(pointNum).fill(1),
				color: colorData,
				border: new Array(pointNum).fill(0),
				borderColor: colorData,
				radius: new Array(pointNum).fill(radius),
			}
			this.scatterplotList[i] = new Scatterplot(data, document.getElementById("capturecanvas" + i))
		}
	}

	addCapture(latentValues, embedding) {
		let index;
		for(let i = 0; i < this.currentVisible.length; i++) {
			if (! this.currentVisible[i]) {
				index = i;
				break;
			}
		}
		this.latentValuesList[index] = deepcopyArr(latentValues);
		this.embeddingList[index] = deepcopyArr(embedding);
		this.currentVisible[index] = true;
		this.scatterplotList[index].update({ position: embedding }, 0, 0)

		document.getElementById("capture" + index).style.visibility = "visible";
	}

	removeCapture(index) {
		this.currentVisible[index] = false;
		document.getElementById("capture" + index).style.visibility = "hidden";
	}

	currentCaptureNum() {
		let num = 0;
		this.currentVisible.forEach((d) => { if(d) num ++; });
		return num;
	}

	returnInfo(index) {
		return [
			this.latentValuesList[index],
			this.embeddingList[index]
		];
	}
}