import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { UserContext } from '../UserContext';
import theme from '../theme';
import axios from 'axios';

const ConnectDisconnectButton = () => {
    const { isConnected, setIsConnected, removeIsConnected } = useContext(UserContext);

    const disconnect = async() => {
        const disconnection = await axios.delete(`http://localhost:3001/user/disconnect`,
            {
                withCredentials: true,
            }
        );
        console.log(disconnection)
        removeIsConnected();
        window.location = '/'
    }


    return (
        <div>
            {isConnected ? (
                <Button
                    variant="contained"
                    sx={{
                        ml: 2,
                        mr: 2,
                        my: 3,
                        py: 2,
                        bgcolor: 'secondary.two',
                        fontSize: 20,
                        color: 'primary.main',
                        fontWeight: 'bold',
                    }}
                    onClick={() => (disconnect())}
                >
                    Disconnect
                </Button>
        ) : (
                <Button
                    variant="contained"
                    sx={{
                        ml: 2,
                        mr: 2,
                        my: 3,
                        py: 2,
                        bgcolor: 'secondary.two',
                        fontSize: 20,
                        color: 'primary.main',
                        fontWeight: 'bold',
                    }}
                    onClick={() => (window.location = '/connection')}
                >
                    Connect
                </Button>
        )}
        </div>
    );
};

export default ConnectDisconnectButton;
