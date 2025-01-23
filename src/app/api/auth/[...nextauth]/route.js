import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

const scopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
].join(',');

export const authOptions = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            authorization: {
                url: 'https://accounts.spotify.com/authorize',
                params: { scope: scopes },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = Date.now() + account.expires_in * 1000;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            return session;
        },
    },
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
