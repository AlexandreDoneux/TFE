import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { UserContext } from '../UserContext';
import theme from '../theme';
import axios from 'axios';

const ConnectDisconnectButton = () => {
    const { isConnected, setIsConnected, removeIsConnected } = useContext(UserContext);

    const disconnect = async() => {

        try{
            const disconnection = await axios.delete(`https://www.alexandre.doneux.eu:8443/user/disconnect`,
                {
                    withCredentials: true,
                }
            );
            console.log(disconnection)
            removeIsConnected();
            window.location = '/'
        }
        catch(error){
            console.log(error.response.data)
            removeIsConnected();
            window.location = '/'
        }
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
