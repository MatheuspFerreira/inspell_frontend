import { useState } from 'react';
import { Button } from '../../components/button/Button';
import { useNavigate } from 'react-router-dom';
import { Carregando } from '../../components/Carregando';
import { Alert } from 'antd';
import './cadastrar.css';


export function Cadastrar () {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [dataTruck, setDataTruck] = useState([]);
    const navigate = useNavigate();
    const newtruck = {};

    function getTruck (event) {

        if(event.target.name !== "ano" && event.target.name !== "rendimento" && event.target.name !== "placa" && event.target.name !== "id"){
            newtruck[event.target.name] = event.target.value;
            
  
        }else if(event.target.name === "ano" || event.target.name === "rendimento") {
            event.target.value = event.target.value.slice(0, 4);
            newtruck[event.target.name] = event.target.value;

        }else if(event.target.name === "placa"){
            event.target.value = event.target.value.slice(0, 7);
            newtruck[event.target.name] = event.target.value;

        }else if(event.target.name === "id"){
            event.target.value = event.target.value.slice(0, 8);
            newtruck[event.target.name] = event.target.value;
        };
        

    };

    function navVoltar () {
        navigate(`/`,{replace:true});

    };

    function navVoltarCadastrar () {
        setError(false);
        setSuccess(false);
        navVoltar();

    };

    const createTruck = async (event) => {
        event.preventDefault();
        setCarregando(true);

        await fetch(`http://localhost:3001/caminhoes/create`,{
            method:'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify ({
                id:newtruck.id,
                apelido:newtruck.apelido,
                placa:newtruck.placa,
                ano:newtruck.ano,
                cor:newtruck.cor,
                rendimento:newtruck.rendimento
                
            })
            
            
        })

        .then(response => response.json())
        .then(data => {
            
            setDataTruck(data);
            setCarregando(false);
            setSuccess(true);
            
            if(data.error) {
                setError(true);
                setSuccess(false);

            };
            
          
        })
        .catch(err => {
            
            setDataTruck(err);
            setError(true);
            

        }) 
        

    };



    return (
        <div>
            <div className={success || error ? "--Disable" :"Cadastrar__container"}>
                <h1>Você está em Cadastrar Veículos</h1>
                <h2>Para cadastrar basta inserir os dados e clicar em salvar</h2>
            
                <div className='Cadastrar__firstcontent'>
                    {carregando && <Carregando />}
                    <form className={carregando ? "--Disable" : "Cadastrar__form"} onSubmit={event => createTruck(event)}>
                        <label htmlFor="id">ID</label>
                        <input type="number" name="id" placeholder={"Digite o ID "} required onChange={event => getTruck(event)} />
                        <label htmlFor="apelido">Apelido</label>
                        <input type="text" name="apelido"  maxLength={30} placeholder={"Digite o apelido"} required onChange={event => getTruck(event)}  />
                        <label htmlFor="placa">Placa</label>
                        <input type="text" name="placa"  minLength={7} maxLength={7} placeholder={"Digite a placa"} required onChange={event => getTruck(event)} />
                        <label htmlFor="ano">Ano</label>
                        <input type="number" name="ano" placeholder={"Digite o ano"}  required onChange={event => getTruck(event)}  />
                        <label htmlFor="cor">Cor</label>
                        <input type="text" name="cor"  maxLength={25} placeholder={"Digite a cor"} required onChange={event => getTruck(event)} />
                        <label htmlFor="rendimento">Rendimento</label>
                        <input type="number" name="rendimento"  placeholder={"Digite o rendimento"} required onChange={event => getTruck(event)} />
                        <section className='Cadastrar__button'>
                            <Button text={"SALVAR"} />
                            <Button text={"VOLTAR"} click={navVoltar}/>
                        </section>
                    </form>
                </div>
            </div>
            <div className={success ? "Cadastrar__container" : "--Disable"}>
                <section className='Cadastrar__alert'>
                    <Alert 
                    message="Caminhão cadastrado com sucesso !"
                    description="Clique em voltar, para continuar navegando em Caminhões"
                    type="success"
                    showIcon
                    />
                    <Button  className='Cadastrar__alert' text={"VOLTAR"} click={navVoltar}/>
                </section>
            </div>
            <div className={error ? "Cadastrar__container" : "--Disable"}>
                <section className='Cadastrar__alert'>
                    <Alert 
                    message={`Ocorreu um erro,${dataTruck.message} !`}
                    description="Clique em voltar, para tentar novamente"
                    type="error"
                    showIcon
                    />
                    <Button  className='Cadastrar__alert' text={"VOLTAR"} click={navVoltarCadastrar}/>
                </section>
            </div>
        </div>
    
    );
    
};