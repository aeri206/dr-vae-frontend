
import axios from 'axios';
import * as d3 from "d3";

export async function reconstruction(url, latentValues) {
	let embedding;
	await axios.get(url + "reconstruction", {
		params: { latentValues: { data: latentValues } }
	}).then(response => {
		embedding = response.data;
	})
	// console.log(embScale(embedding)); // embedding should be 2D array (N)[Array(2), Array(2)..]
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
		data.vec = embScale(data.vec)
		
	})
	return data;
}

export async function getKnn(url, latentValues, n) {
	let knn;
	await axios.get(url + "getknn", {
		params: { latentValues: { data: latentValues }, n:n }
	}).then(response => {
		
		knn = response.data;
		if (n > 0){
			knn.embs = knn.embs.map(emb => embScale(emb))
		}
	})
	return knn;
}

export async function latentCoorToOthers(url, coor) {
	let data;
	
	await axios.get(url + "latentcoortoothers", {
		params: { coor: { data: coor }}
	}).then(response => {
		data = response.data;
		data.emb = embScale(data.emb);
	});
	return data;
}

export async function reload(url, dataset, pointNum, idx) {
	let latent_dims;
	await axios.get(url + "reload", {
		params: { dataset, pointNum, idx }
	}).then(res => {
		latent_dims = res.data
	});
	return latent_dims;
}

export async function getDim(url, dataset, pointNum) {
	let latent_dims;
	await axios.get(url + "getdims", {
		params: { dataset, pointNum }
	}).then(res => {
		latent_dims = res.data
	})
	return latent_dims;
	}