
import axios from 'axios';
import * as d3 from "d3";

export async function reconstruction(url, latentValues) {
	let embedding;
	await axios.get(url + "reconstruction", {
		params: { latentValues: { data: latentValues } }
	}).then(response => {
		embedding = response.data;
	})
	return embScale(embedding)
}

function embScale(embedding) {
	const xMax = d3.max(embedding.map(d => d[0]));
	const xMin = d3.min(embedding.map(d => d[0]));
	const yMax = d3.max(embedding.map(d => d[1]));
	const yMin = d3.min(embedding.map(d => d[1]));
	const xScale = d3.scaleLinear().domain([xMin, xMax]).range([-0.9, 0.9]);
	const yScale = d3.scaleLinear().domain([yMin, yMax]).range([-0.9, 0.9]);
	return embedding.map((d) => {
		return [xScale(d[0]), yScale(d[1])];
	});
}

export async function getLatentEmb(url) {
	let data;
	await axios.get(url + "getlatentemb").then(response => {
		data = response.data;
	})
	return data;
}

export async function getKnn(url, latentValues) {
	let knn;
	await axios.get(url + "getknn", {
		params: { latentValues: { data: latentValues } }
	}).then(response => {
		knn = response.data;
	})
	return knn;
}
