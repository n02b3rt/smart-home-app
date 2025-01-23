'use client';

import {useSession, signIn, signOut} from 'next-auth/react';
import React, {useEffect, useState} from 'react';

import PlayIcon from '/public/icons/play_arrow.svg';
import PauseIcon from '/public/icons/pause.svg';
import NextIcon from '/public/icons/skip_next.svg';
import PrevIcon from '/public/icons/skip_previous.svg';
import SpotifyIcon from '/public/icons/icons8-spotify-250.svg';

import './SpotifyPlayer.scss'

const SpotifyPlayer = () => {
    const {data: session} = useSession();
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    // Fetch currently playing track
    const fetchCurrentTrack = async () => {
        if (!session || !session.accessToken) return;

        try {
            const response = await fetch(
                'https://api.spotify.com/v1/me/player/currently-playing',
                {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                    },
                }
            );

            if (response.status === 204 || response.status === 401) {
                setCurrentTrack(null);
                return;
            }

            const data = await response.json();
            setCurrentTrack(data);
            setIsPlaying(data.is_playing);
        } catch (error) {
            console.error('Error fetching current track:', error);
        }
    };

    const fetchUserProfile = async () => {
        if (!session || !session.accessToken) return;

        try {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            const data = await response.json();
            setUserProfile(data);
        } catch (error) {
            console.error('Failed to fetch user profile: ', error);
        }
    };

    // Play/Pause track
    const togglePlayPause = async () => {
        if (!session || !session.accessToken) return;

        try {
            const url = isPlaying
                ? 'https://api.spotify.com/v1/me/player/pause'
                : 'https://api.spotify.com/v1/me/player/play';

            await fetch(url, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            });

            setIsPlaying(!isPlaying);
            fetchCurrentTrack(); // Odśwież dane po akcji
        } catch (error) {
            console.error('Error toggling play/pause:', error);
        }
    };

    // Skip to next track
    const skipToNext = async () => {
        if (!session || !session.accessToken) return;

        try {
            await fetch('https://api.spotify.com/v1/me/player/next', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            });

            await fetchCurrentTrack(); // Odśwież dane po akcji
        } catch (error) {
            console.error('Error skipping to next track:', error);
        }
    };

    const skipToPrev = async () => {
        if (!session || !session.accessToken) return;

        try {
            await fetch('https://api.spotify.com/v1/me/player/previous', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            });

            await fetchCurrentTrack(); // Odśwież dane po akcji
        } catch (error) {
            console.error('Error skipping to next track:', error);
        }
    };

    useEffect(() => {
        if (session) {
            fetchCurrentTrack(); // Odśwież na start
            session ? fetchUserProfile() : null;
            // Automatyczne odświeżanie co 5 sekund
            const interval = setInterval(() => {
                fetchCurrentTrack();
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [session]);

    if (!session) {
        return (
            <div>
                <p>You are not logged in. Please log in with Spotify to use the player.</p>
                <button onClick={() => signIn('spotify')}>Log in with Spotify</button>
            </div>
        );
    }

    if (!currentTrack) {
        return (
            <div>
                <p>No track is currently playing.</p>
                <button onClick={() => signOut()}>Log out</button>
            </div>
        );
    }

    return (
        <div className="spotifyPlayer">
            {
                userProfile ?
                    <p className="spotifyPlayer__user">
                        <SpotifyIcon className="spotifyPlayer__user-icon" />
                        {userProfile.display_name}
                    </p>:""
            }
            <img
                src={currentTrack.item.album.images[0].url}
                alt={currentTrack.item.name}
                className="spotifyPlayer__album"
            />

            <div className="spotifyPlayer__songInfo">
                <p className="spotifyPlayer__title">{currentTrack.item.name}</p>
                <p className="spotifyPlayer__artists">{currentTrack.item.artists.map((artist) => artist.name).join(', ')}</p>
            </div>

            <div className="spotifyPlayer__player">
                <button onClick={skipToPrev}>
                    <PrevIcon className="spotifyPlayer__icon"/>
                </button>
                <button onClick={togglePlayPause}>
                    {
                        isPlaying ?
                            <PauseIcon className="spotifyPlayer__icon"/> :
                            <PlayIcon className="spotifyPlayer__icon"/>
                    }
                </button>
                <button onClick={skipToNext}>
                    <NextIcon className="spotifyPlayer__icon"/>
                </button>
            </div>
        </div>
    );
};

export default SpotifyPlayer;
