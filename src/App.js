import React, { useState } from 'react';

import Renderer from './Renderer';

const App = () => {
	const [ gbXMLURL, setgbXMLURL ] = useState(
		'https://raw.githubusercontent.com/ladybug-tools/spider/5b4575f2d1905e1aedf282603fc4155bb679ba18/read-gbxml/data-files/sam-live2.xml'
		//'https://raw.githubusercontent.com/ladybug-tools/spider/master/read-gbxml/data-files/generated1.xml'
	);

	return (
		<div>
			<button
				onClick={() =>
					setgbXMLURL(
						'https://raw.githubusercontent.com/ladybug-tools/spider/master/read-gbxml/data-files/generated1.xml'
					)}
			>
				change gbxml
			</button>
			<Renderer gbXMLURL={gbXMLURL} />
		</div>
	);
};

export default App;
