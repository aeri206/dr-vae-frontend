import React from 'react';
import '../css/fileupload.css'

const FileUpload = (props) => {
	return (
		<div className={"fileupload"}style={{width: props.size - 20, height: props.size * 0.35 - 20}}>
			<div>
				<button className={"fileUploadButton"}>Default dataset</button>
				<button className={"fileUploadButton"}>Import File</button>
				<input defaultValue={"browse file..."}/>
			</div>
			<div>
				<div className={"progressDiv"}>
					<div className="progress">
						Dataset Generation
					</div>
					<progress className="file" value="32" max="100"></progress>
				</div>
				<div style={{display: "flex"}}>
					<div className="progress">
						Training VAE
					</div>
					<progress className="file" value="57" max="100"></progress>
				</div>
			</div>

		</div>
	)
}

export default FileUpload;