import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";

import JoinRoomPage from "./JoinRoomPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";

const RenderHomePage =
	<Grid container spacing={3}>
		<Grid item xs={12} align="center">
			<Typography variant="h3" compact="h3">
				House Party
			</Typography>
		</Grid>
		<Grid item xs={12} align="center">
			<ButtonGroup disableElevation variant="contained" color="primary">
				<Button color="primary" to="/join" component={Link}>
					Join a Room
				</Button>
				<Button color="secondary" to="/create" component={Link}>
					Create a Room
				</Button>
			</ButtonGroup>
		</Grid>
	</Grid>


const HomePage = () => {
	const [roomCode, setRoomCode] = useState(undefined);

	const clearRoomCode = () => {
		setRoomCode(undefined);
	};

	useEffect(() => {
		fetch("/api/user-in-room")
			.then((response) => response.json())
			.then((data) => {
				if (data.code) {
					setRoomCode(data.code);
				}
			})
			.catch((error) => console.error(error));
	}, []);

	return (
		<Router>
			<Routes>
				<Route path="/" element={
					roomCode ? <Navigate to={"/room/" + roomCode} replace /> : RenderHomePage
				}
				/>
				<Route path="/join" element={<JoinRoomPage />} />
				<Route path="/create" element={<CreateRoomPage />} />
				<Route path="/room/:roomCode" element={<Room leaveRoomCallback={clearRoomCode} />} />
			</Routes>
		</Router>
	);
};

export default HomePage;
