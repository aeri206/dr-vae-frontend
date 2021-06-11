import * as d3 from "d3";
import  {deepcopyArr } from "../../helpers/utils"

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
		this.latentValuesList[index] = deepcopyArr(latentValues);
		this.embeddingList[index] = deepcopyArr(embedding);
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

	returnInfo(index) {
		return [
			this.latentValuesList[index],
			this.embeddingList[index]
		];
	}
}