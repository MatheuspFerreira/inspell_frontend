import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/button/Button';
import { Carregando } from '../../components/Carregando';
import { Alert } from 'antd';
import './editar.css';

export function Editar () {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [dataTruck, setDataTruck] = useState([]);
    const navigate = useNavigate();
    const newtruck = {};
    let { id } = useParams();

    
    useEffect(() => {
    
        
        const getOne = async () => {
            setCarregando(true)

            await fetch(`http://localhost:3001/caminhoes/getone/${id}`,{
            method:'GET',
            headers: {"Content-Type": "application/json"},
            
            })

            .then(response => response.json())
            .then(data => {
            
                setData(data);
                setCarregando(false);
                
          
            })
            .catch(err => {
                
                setCarregando(false);
            }) 
        }
        getOne();
        
        
    },[id]);


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

    const putTruck = async (event) => {
        event.preventDefault();
        setCarregando(true);

        await fetch(`http://localhost:3001/caminhoes/update/${data.id}`,{
            method:'PUT',
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

            }
          
        })
        .catch(err => {
            console.log(err)
            setDataTruck(err);
            setError(true);
            
        }) 
        

    };

    function navVoltarCadastrar () {
        setError(false);
        setSuccess(false);
        navVoltar();

    };


    return (
        <div>
            <div className={success || error ? "--Disable" :"Editar__container"}>
                <h1>Você está em Editar Veículos</h1>
                <h2>Para editar basta preencher as novas informações e clicar no botão salvar</h2>
                <h3>Você está editando o veículo de apelido <span>{data.apelido}</span> com o ID <span>{data.id}</span></h3>
                <div>
                    {carregando && <Carregando />}
                    <form className={carregando ? "--Disable" : "Editar__form"} onSubmit={event => putTruck(event)}>
                        <label htmlFor="id">ID</label>
                        <input type="number" name="id" placeholder={data.id} required onChange={event => getTruck(event)} />
                        <label htmlFor="apelido">Apelido</label>
                        <input type="text" name="apelido"  maxLength={30} placeholder={data.apelido} required onChange={event => getTruck(event)}  />
                        <label htmlFor="placa">Placa</label>
                        <input type="text" name="placa"  minLength={7} maxLength={7} placeholder={data.placa} required onChange={event => getTruck(event)} />
                        <label htmlFor="ano">Ano</label>
                        <input type="number" name="ano" placeholder={data.ano}  required onChange={event => getTruck(event)}  />
                        <label htmlFor="cor">Cor</label>
                        <input type="text" name="cor"  maxLength={25} placeholder={data.cor} required onChange={event => getTruck(event)} />
                        <label htmlFor="rendimento">Rendimento</label>
                        <input type="number" name="rendimento"  placeholder={data.rendimento} required onChange={event => getTruck(event)} />
                        <section className='Cadastrar__button'>
                            <Button text={"SALVAR"} />
                            <Button text={"VOLTAR"} click={navVoltar}/>
                        </section>
                    </form>
                </div>
         </div>
         <div className={success ? "Editar__container" : "--Disable"}>
                <section className='Editar__alert'>
                    <Alert 
                        message="Caminhão atualizado com sucesso !"
                        description="Clique em voltar, para continuar navegando em Caminhões"
                        type="success"
                        showIcon
                    />
                    <Button  className='Editar__alert' text={"VOLTAR"} click={navVoltar}/>
                </section>
            </div>
            <div className={error ? "Editar__container" : "--Disable"}>
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