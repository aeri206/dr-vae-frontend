import * as d3 from "d3";

export class CaptureViewManage {
	constructor(dom) {
		this.dom = dom.current;
		this.latentValuesList = [[], [], []];
		this.embeddingList = [[], [], []];    // coordinates
		this.currentVisible = [false, false, false];
	}

	addCapture(latentValues, embedding) {
		let index;
		for(let i = 0; i < this.currentVisible.length; i++) {
			if (! this.currentVisible[i]) {
				index = i;
				break;
			}
		}
		this.latentValuesList[index] = latentValues;
		this.embeddingList[index] = embedding;
		this.currentVisible[index] = true;
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
}