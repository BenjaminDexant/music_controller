import React from "react";
import { render } from "react-dom";
import HomePage from "./components/HomePage";

const App = () =>
	<div className="center">
		<HomePage />
	</div>

export default App;

const appDiv = document.getElementById("app");
render(<App />, appDiv);
