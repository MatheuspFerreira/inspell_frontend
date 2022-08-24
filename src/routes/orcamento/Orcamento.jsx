import { useEffect, useState } from 'react';
import { Button } from '../../components/button/Button';
import { Carregando } from '../../components/Carregando';
import { Alert } from 'antd';
import './orcamento.css';


export function Orcamento () {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [dataTruck, setDataTruck] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [rendimento, setRendimento] = useState([]);
    const [distancia, setDistancia] = useState([]);
    const [custoTotal, setCustoTotal] = useState([]);
    const [precoFinal, setPrecoFinal] = useState([])
    const [precoCombustivel, setPrecoCombustivel] = useState([]);
    const [consumoEsperado, setConsumoEsperado] = useState([]);
    const pagamentoFuncionario = 5000.00;



    useEffect(()=> {
        const getLocalidades = async (event) => {
            setCarregando(true)
    
            await fetch(`http://localhost:3000/localidades`,{
                method:'GET',
                headers: {"Content-Type": "application/json"},
                 
            })
            .then(response => response.json())
            .then(data => {
                setLocalidades(data);
                setCarregando(false);
              
                if(data.error) {
                    setError(true);
                   
                };
                
              
            })
            .catch(err => {
                setLocalidades(err);
                setError(true);
                
            });
        
        };

        const getCaminhao = async (event) => {
            setCarregando(true)
    
            await fetch(`http://localhost:3000/caminhoes`,{
                method:'GET',
                headers: {"Content-Type": "application/json"},
                
            })
            .then(response => response.json())
            .then(data => {
                setDataTruck(data);
                setCarregando(false);
             
                if(data.error) {
                    setError(true);
                    
                };
                
            })
            .catch(err => {
                setError(true);
            
            });
    
        };
        getLocalidades();
        getCaminhao();
   
    },[]);

    function navVoltar () {
        document.location.reload(true);

    };

    function caminhaoRendimento (event) {
        setRendimento(event.target.value.split(","));

    };

    function localidadeDistancia (event) {
        setDistancia(event.target.value.split(","));

    };

    function getPrecoCombustivel (event) {
        let newEvent = event.target.value.split("R$");
        newEvent = newEvent[1].trim();
        newEvent = newEvent.replace(".", "");
        newEvent = newEvent.replace(",",".");
        setPrecoCombustivel(newEvent);

    };

    function mascaraMoeda(event) {
        const onlyDigits = event.target.value
          .split("")
          .filter(s => /\d/.test(s))
          .join("")
          .padStart(3, "0")
        const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2)
        event.target.value = maskCurrency(digitsFloat)

    };
      
    function maskCurrency(valor, locale = 'pt-BR', currency = 'BRL') {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency
        }).format(valor)
    };

    function gerarOrcamento (event) {
        event.preventDefault();
        calcula();
        setSuccess(true);
    };

    function calcula () {
        const consumo = (distancia[1] * 2) / rendimento[1];
        setConsumoEsperado(consumo.toFixed(2));
        const custoDaViajem = (consumo * precoCombustivel) + pagamentoFuncionario;
        
        setCustoTotal(custoDaViajem.toFixed(2).replace(".",","));
        const precoFinal = (custoDaViajem * 0.20) + custoDaViajem;
        setPrecoFinal(precoFinal.toFixed(2).replace(".",","));
        setPrecoCombustivel(precoCombustivel.replace(".",","))
        
    
    };


    function getRendimento (event) {
        event.target.value = ""

    };

    function getDistancia (event) {
        event.target.value = ""

    };
   
    
    return (
        <div>
            <div className={success || error ? "--Disable" :"Orcamento__container"}>
                <h1>Você está em Orçamento</h1>
                <h2>Para fazer um orçamento, baste preencher os dados e clicar em Orçamento</h2>
                <div className='Orcamento__firstcontent'>
                    {carregando && <Carregando />}
                    <form className={carregando ? "--Disable" : "Orcamento__form"} onSubmit={event => gerarOrcamento(event)}>

                        <label htmlFor="Caminhão">Caminhão</label>  
                        <select name="Caminhão" required className='Orcamento__option' onChange={event => caminhaoRendimento(event)} >
                            
                            <option  >Selecione seu caminhão</option>
                            { 
                                dataTruck.map((local, index) => {
                                   
                                    
                                    const menuCaminhao = <option key={index} value={[local.apelido, local.rendimento]} >{`${local.apelido}`}</option>

                                    return  menuCaminhao
                                })  
                            }  
                        </select>
                        <section>
                            <label htmlFor="Consumo">Rendimento (km/L)</label>
                            <input type="text" name="Consumo"   value={rendimento[1] || ""}  placeholder='Selecione seu Caminhão' required= {true} onChange={event => getRendimento(event)}/>

                        </section>
                        <section>
                            <label htmlFor="combustível">Preço do combustível (L)</label>
                            <input type="text" name="combustível"  maxLength={9} onInput={event => mascaraMoeda(event)} required onChange={event => getPrecoCombustivel(event)}/>

                        </section>
                        <label htmlFor="localidade">Localidade de Destino</label>
                        <select name="localidade" required className='Orcamento__option' onChange={event=> localidadeDistancia(event)}>
                            <option >Selecione a Localidade</option>
                            { 
                                error 
                                ? 
                                "" 
                                :
                                localidades.map((local, index) => {
        
                                    const menuLocalidade = <option key={index} value={[local.nome,local.distancia]}>{`${local.nome}`}</option>
     
                                    return menuLocalidade;
                                })
                            } 

	                    </select>
                        <section>
                            <label htmlFor="Distancia">Distância (km)</label>
                            <input type="text" name="Distancia"  value={distancia[1] || "" } placeholder='Seleciona sua Localidade'  required onChange={event=>getDistancia(event)}/>

                        </section>
                        <section>
                            <label htmlFor="Pagamento funcionarios">Pagamento dos funcionários</label>
                            <input type="text" name="Pagamento funcionarios" defaultValue={`R$${pagamentoFuncionario},00`} readOnly required/>

                        </section>
                        <section className='Orcamento__button'>
                            <Button  text={"Orçamento"} />

                        </section>
                    </form>
                </div>
            </div>
            <div className={success ? "Orcamento__container" : "--Disable"}>
                <section className='Orcamento__alert'>
                    <Alert 
                        message="Seu orçamento foi realizado com sucesso !"
                        description="Clique em voltar."
                        type="success"
                        showIcon
                    />
                </section>
                <div className='Orcamento__display'>
                    <ul>
                        <li>
                            <p>Caminhão: </p>
                            <span>{rendimento[0]}</span>
                            
                        </li>
                        <li>
                            <p>Localidade de Destino:</p>
                            <span>{distancia[0]}</span>
                            
                        </li>
                        <li>
                            <p>Consumo esperado:</p>
                            <span>{`${consumoEsperado} Litros`}</span>
                            
                        </li>
                        <li>
                            <p>Preço do combustível:</p>
                            <span>{`R$ ${precoCombustivel}`}</span>
                            
                        </li>
                        <li>
                            <p>Motorista e ajudante:</p>
                            <span>{`R$ ${pagamentoFuncionario},00`}</span>
                            
                        </li>
                        <li>
                            <p>Custo da viagem:</p>
                            <span>{`R$ ${custoTotal}`}</span>
                            
                        </li>
                        <li>
                            <p>Preço final:</p>
                            <span>{`R$ ${precoFinal}`}</span>
                            
                        </li>
                    </ul>
                </div>
                <Button  className='Orcamento__alert' text={"VOLTAR"} click={navVoltar}/>
            </div>
            <div className={error ? "Orcamento__container" : "--Disable"}>
                <section className='Orcamento__alert'>
                    <Alert 
                        message={`Ocorreu um erro no carregamento!`}
                        description="Clique em voltar, para tentar novamente"
                        type="error"
                        showIcon
                    />
                </section>
                <section className='Orcamento__button'>
                    <Button  text={"VOLTAR"} click={navVoltar} />
                </section>
            </div>
        </div>
    
    );
    
};