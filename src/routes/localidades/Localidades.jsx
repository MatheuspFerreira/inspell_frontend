import './localidades.css'
import {  useEffect, useState } from 'react';
import { Alert } from 'antd';
import Papa from "papaparse";
import { Carregando } from '../../components/Carregando';
import { Button } from '../../components/button/Button';


export function Localidades () {
  const [csv, setCsv] = useState([]); 
  const [data, setData] = useState([]);
  const [newData, setNewData]= useState([]);
  const [csvError, setCsvErro] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [carregando, setCarregando]= useState(false);
  const [feed, setFeed] = useState(false);
  const [errorData, setErrorData] = useState(false);
  
    

  useEffect(()=> {
    const verificaData = data.some( (current) => {
      return current.id || current.name || current.distancia
    });

    if(verificaData) {
      const postCsvJson = async () => {
      setCarregando(true)
      setFeed(false)
      setErrorData(false)
      setNewData([])
      
      await fetch('http://localhost:3000/localidades/create',{
        method:'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify ({

          data

        })
      })
      .then(response => response.json())
      .then(data => {

        if(data.error) {
          setCarregando(false);
          setNewData(data);
          

        }else {
          setCarregando(false);
          setNewData(data);
          setFeed(true);

        };
      })
      .catch(err => {
        setNewData(err);
        setCarregando(false);
        setErrorData(true);
        
        console.log(err)

      }); 
    }
    postCsvJson();
  };
  
  },[data]);
   
  function verificaCsv (event) {
    setCsvErro(false);

    if(event.target.files[0].name.split(".")[1] === "csv"){
      setCsv(event.target.files[0]);
      setFileError(false);
          
    }else {
      setCsvErro(true);
      return;
           
    };
        
  };
    
  function converteCsv () {
    setFileError(false)

    if(csv.length !== 0){

      Papa.parse(csv, {
        download: true,
        header:true,
        encoding: "ISO-8859-1",
        complete: function(results) {
          let newObj = []   
          results.data.map(value => {
            removeEmpty(value)
            if(value && value.distancia) {
              value.distancia = value.distancia.replace("," , ".")
                        
            };
            if(Object.keys(removeEmpty(value)).length !==0) {   
              newObj.push(removeEmpty(value)) 
              setData(newObj)
                        
                        
            };
            return value
          })
        }
      })
        
    }else {
      setFileError(true)

    };
          
  };
     
  function removeEmpty(object) {
    Object.keys(object).forEach((key) => {
      if (object[key] && typeof object[key] === 'object') {
        removeEmpty(object[key]);

        if (Object.keys(object[key]).length === 0){
          delete object[key]; 
                  
        };
                
      }else if (object[key] == null || object[key] === '' || (typeof object[key] === 'object' && object[key].length === 0)) {
        delete object[key];
                  
      };

    });
    
    return object
        
  };
 

  return(
    <div className='Localidades__container'>
      <h1>Você está em Localidades</h1>
      <div className='Localidades__firstContent'>
        <h1>Você pode cadastar novas localidades enviando um arquivo CSV</h1>   
        <input type="file" name="file" accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' onChange={event => verificaCsv(event)}/>
        {carregando ? <Carregando /> : <Button text={"ENVIAR"} click={converteCsv} />}
        { 
          feed 
          ? 
          <ul>
            <li>Localidades Cadastradas: {newData.cadastrado.length}</li>
              <li>Localidades não Cadastradas: {newData.naocadastrado.length}</li>
          </ul>
          :
          ""
        }
        {
          feed && newData.naocadastrado.length > 0 
          ? 
          <Alert className='Localidades__alert'
            message={` ${newData.naocadastrado.length} Localidades já estavam cadastradas!`} 
            type="warning" 
          /> 
          : 
          ""
        }
        {
          feed && newData.naocadastrado.length === 0 
          ? 
          <Alert className='Localidades__alert'
            message={`Todas as Localidades foram cadastradas com sucesso!`}
            type="success" 
          /> 
          : 
          "" 
        }
        {
          csvError 
          ? 
          <Alert className='Localidades__alert'
            message="Você só pode enviar arquivos com formato CSV"
            type="error"
            showIcon
          /> 
          :
           ""
        }
        {
          fileError 
          ? 
          <Alert className='Localidades__alert'
              message="Você precisa selecionar um arquivo"
              type="error"
              showIcon
          /> 
          :
          ""
        }
        {
          newData.error 
          ?
          <Alert className='Localidades__alert'
            message={`${newData.message}. Confira sua planilha`}
            type="error"
            showIcon
          /> 
          :
          ""
        }
        {
          errorData
          ?
          <Alert className='Localidades__alert'
            message={`${newData}, falha no servidor`}
            type="error"
            showIcon
          /> 
          :
          ""
          }           
    </div>
  </div>
  )
}