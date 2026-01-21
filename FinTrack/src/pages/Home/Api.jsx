
// conectando back com front

import { useState, useEffect } from 'react'
import axios from 'axios';

const Api = () => {
    const [message, setMessage] = useState('carregando...');
    
    useEffect(() => {
        // testando axios
        axios.get('http://localhost:3000/')
            .then((response) => {
                setMessage(response.data.message)
            })
            .catch((error) => {
                console.error("O erro foi:", error)
                setMessage("faltou a API aqui veinho")
            });

        // fetch('http://localhost:3000/').then((res) => res.json()).then((data) => {
        //     setMessage(data.message);
        // }).catch(err => {
        //     setMessage('Erro ao conectar com a API');
        //     setMessage('Erro ao conectar com a API', err);
        // }, []);
    }, []);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
};

export default Api
