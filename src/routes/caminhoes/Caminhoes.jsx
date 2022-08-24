import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '../../components/Box';
import { Button } from '../../components/button/Button';
import { Carregando } from '../../components/Carregando';
import { Alert } from 'antd';
import './caminhoes.css';




export function Caminhoes () {
    const [data, setData] = useState([]);
    const [error, setError] = useState(false);
    const [errorData, setErrorData] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();
  

    useEffect(() => {
        
        const getAll = async () => {
            setCarregando(true);
            setError(false);

            await fetch('http://localhost:3001/caminhoes',{
            method:'GET',
            headers: {"Content-Type": "application/json"},
            
            })

            .then(response => response.json())
            .then(data => {
                setData(data);
                setCarregando(false);

                if(data.length === 0) {
                    setError(true);
                    setErrorData(data.message="Você não possui veículo cadastrado");
                    
                };
          
            })
            .catch(err => {
                setError(true);
                setErrorData(err);

            }) 
        }
        getAll();
        
    },[]);

    function navCadastrar () {
        navigate(`/cadastrar`,{replace:true});

    };

   
    return (
        <div className="Caminhoes__container">
            <div className="Caminhoes__firstContent">
                <h1>Você está em Caminhões</h1>
                <section className='Caminhoes__section'>
                    <h1>Para cadastrar um novo veículo clique em cadastrar</h1>
                    <Button
                    text={"CADASTRAR"}
                    click={navCadastrar}
                    />
                </section>
            </div>
            <div className="Caminhoes__secondContent">
                <h1>Meus Caminhões</h1>
                <section className={error ? "--Disable" : "Caminhoes__secondSection"}>
                    { 
                        carregando 
                        ? 
                        <Carregando/> 
                        : 
                        data.map((obj, index) =>
                        <Box  key = {`obj-${index}`} 
                        id={obj.id} 
                        apelido={obj.apelido}
                        placa={obj.placa}
                        ano={obj.ano}
                        cor={obj.cor}
                        rendimento={obj.rendimento}

                        />
                    )}

                </section>
                <section className={error ? 'Caminhoes__alert' : "--Disable"}>
                    <Alert 
                        message="Erro ao carregar seus veículos !"
                        description={`${errorData}`}
                        type="error"
                        showIcon
                    />
                </section>
            </div>
        </div>

    );
};