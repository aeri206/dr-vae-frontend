import React from 'react';

import "../css/mainview.css";

const ExampleView = (props) => {

	

	return (
		<div 
			className="functionViews exampleView"
			style={{
				width: props.width,
				height: props.height
			}}
		>
		</div>
	)
}

export default ExampleView;