import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../button/Button';
import { Carregando } from '../Carregando';
import { Alert } from 'antd';
import './box.css';



export function Box ({id, apelido, placa, ano, cor, rendimento}) {
    const [newDelete, setNewDelete] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    function confirmaExcluir () {
        setNewDelete(true);
    };

    function naoExcluir () {
        setNewDelete(false);
    };

    function navEditar () {
        navigate(`/editar/${id}`, {replace:true});

    };

    function tentarNovamente () {
        document.location.reload(true);

    }
 
    const  excluir = async() => {
        setCarregando(true);
        setNewDelete(false);
        setError(false)
        
        await fetch(`http://localhost:3000/caminhoes/delete/${id}`,{
            method:'DELETE',
            headers: {"Content-Type": "application/json"},
            
        })
        .then(response => response.json())
        .then(data => {
            
            if(data.error) {
                setError(data);

            }else {
                setCarregando(false);
                document.location.reload(true);

            };
            
        })
        .catch(err => {
            setError(err);
            
        });
    };

   
    return (
        
        <div className='Box__container'>
            <ul>
                <li>ID: {id}</li>
                <li>Apelido: {apelido}</li>
                <li>Placa: {placa}</li>
                <li>Ano: {ano}</li>
                <li>Cor: {cor}</li>
                <li>Rendimento: {rendimento}km/L </li>
                
            </ul>
            <section className={newDelete || carregando? "--Disable" : "Box__confirmar"}>
                <Button text={"Editar"} click={navEditar}/>
                <Button text={"Excluir"} click={confirmaExcluir} />

            </section>  
            <section className={newDelete ? "Box__confirmar" : "--Disable"}>
                < h1>Deseja mesmo excluir esse veículo ?</h1>
                <Button text={"SIM"} click={excluir} />
                <Button text={"NÃO"} click={naoExcluir} />

            </section>
            { carregando && <Carregando />}
            <section className={error.data ? 'Box__confirmar' : "--Disable"}>
                <Alert 
                    message={error.message}
                    description="Clique em voltar, para tentar novamente"
                    type="error"
                    showIcon
                />
                <Button text={"VOLTAR"} click={tentarNovamente}/>

            </section>
        </div>
    );

}