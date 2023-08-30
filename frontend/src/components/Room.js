import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

const Room = ({ leaveRoomCallback }) => {
    const navigate = useNavigate();
    const [votesToSkip, setVotesToSkip] = useState(2);
    const [guestCanPause, setGuestCanPause] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const [currentSong, setCurrentSong] = useState({});

    console.log("Current Song :", currentSong)

    let { roomCode } = useParams();

    const authenticateSpotify = () => {
        fetch("/spotify/is-authenticated")
            .then((response) => response.json())
            .then((data) => {
                console.log("Spotify Authenticated :", data.status);
                setSpotifyAuthenticated(data.status);
                if (!data.status) {
                    fetch("/spotify/get-auth-url")
                        .then((response) => response.json())
                        .then((data) => window.location.replace(data.url))
                        .catch((error) => console.error(error));
                }
            })
            .catch((error) => console.error(error));
    }

    const getRoomDetails = () => {
        fetch("/api/get-room" + "?code=" + roomCode)
            .then((response) => {
                if (!response.ok) {
                    leaveRoomCallback();
                    navigate("/", { replace: true });
                }
                return response.json()
            })
            .then((data) => {
                setVotesToSkip(data.votes_to_skip);
                setGuestCanPause(data.guest_can_pause);
                setIsHost(data.is_host);
            })
            .catch((error) => console.error(error));
    };

    const handleLeaveButton = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/api/leave-room", requestOptions)
            .then((_response) => {
                console.log("Room left!");
                leaveRoomCallback();
                navigate("/", { replace: true });
            })
            .catch((error) => console.error(error));
    }

    const getCurrentSong = () => {
        fetch("/spotify/current-song")
            .then((response) => {
                console.log("Is a song playing ?", response.ok);
                if (!response.ok) {
                    return {};
                } else {
                    return response;
                }
            })
            .then((data) => {
                setCurrentSong({ data });
            })
            .catch((error) => console.error(error));
    }


    useEffect(() => {
        getRoomDetails();

        return () => {
            setVotesToSkip(2);
            setGuestCanPause(false);
            setIsHost(false);
        };
    }, []);

    useEffect(() => {
        if (isHost) {
            authenticateSpotify();
        }
    }, [isHost]);

    useEffect(() => {
        const interval = setInterval(getCurrentSong, 1000);
        return () => clearInterval(interval);
    }, [spotifyAuthenticated]);

    const renderSettingsButton =
        <Grid item xs={12} align="center">
            <Button variant="contained" color="primary" onClick={() => setShowSettings(!showSettings)}>
                Settings
            </Button>
        </Grid>

    if (showSettings) {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage
                        update={true}
                        votesToSkip={votesToSkip}
                        guestCanPause={guestCanPause}
                        roomCode={roomCode}
                        updateCallback={getRoomDetails}
                        setShowSettings={setShowSettings}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setShowSettings(false)}
                    >
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    } else {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {roomCode}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Votes: {votesToSkip}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Guest Can Pause: {guestCanPause?.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Host: {isHost?.toString()}
                    </Typography>
                </Grid>
                <MusicPlayer {...currentSong} />
                {isHost ? renderSettingsButton : null}
                <Grid item xs={12} align="center">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleLeaveButton()}
                    >
                        Leave Room
                    </Button>
                </Grid>
            </Grid>
        )
    }
}

export default Room;
