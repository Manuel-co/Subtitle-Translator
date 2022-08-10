
import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';


function App() {
  const [option, setOptions] = useState([]);
  const [lang1, setLang1] = useState('');
  const [lang2, setLang2] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [state, setState] = useState('');
  const [filename, setFilename] = useState('');

  const handleFile = (e) => {
    console.log(e.target.files[0]);
    console.log(e.target.files[0].name);
    setFilename(e.target.files[0].name);
  }

  const showFile = (e)=>{
    e.preventDefault();
    const reader = new FileReader();
    reader.onload =(e) =>{
      const test = e.target.result
      console.log(test);
      setInput(test)
    };
    reader.readAsText(e.target.files[0]);
  }

    useEffect(() => {
      axios.get("https://libretranslate.de/languages",{
        headers:{
        'accept':'application/json'
      }}).then((res)=>{
        console.log(res.data);
        setOptions(res.data)
      })
    },[])
   
    const translate = (e) => {
      e.preventDefault()
      const params = new URLSearchParams()
      params.append('q', input);
      params.append('source', lang1);
      params.append('target', lang2);
      params.append('api_key','xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
      axios.post("https://libretranslate.de/translate",params,{
        headers:{
          'accept':'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        console.log(res.data);
        let valo =`${res.data.translatedText}`;
        setOutput(valo);
        console.log(output);
      })

    params.append("text", output);
    params.append("filename", filename);
    
    axios.post("http://localhost:9000",params,{ 
    }).then((res)=>{
      console.log('success :', res.data);
    }).catch((error)=>{
      console.log('error', error);
    })

    axios.get("http://localhost:9000").then(function(response){
      setState(response)
      console.log('this is:', response);
    }, [])
    }

  return (
    <div className="App">
     <div className='container-header'>
        <h2>Subtitle Translator</h2>
      </div>
      <div className='container-content'>
        <div className='container-body'>
          <h2>Enter subtitle file below</h2>
          <input 
          type='file' 
          name='file'
          accept='.srt'
          onChange = {handleFile} 
          onInput={showFile}/>
        </div>

        <div className='container-select'>
          <h2 className='select1'>Select input language ({lang1}) </h2>
          <select className='selector1' name='lang' id='lang' onChange={e => setLang1(e.target.value)}>
           {option.map(opt => (<option key = {opt.code} value = {opt.code} > {opt.name}</option>))} 
          </select>

          <h2 className='select2'>Select output language ({lang2}) </h2>
          <select className='selector2' onChange={e => setLang2(e.target.value)}>
            {option.map(opt => (<option key = {opt.code} value = {opt.code} > {opt.name}</option>))} 
          </select>
        </div>
       
        <div className='container-button'>
            <button onClick={translate}>translate</button>
        </div>
        <div className='container-button'>
          <a href='http://localhost:9000'>
            <button>Download</button>
          </a>
        </div>
      </div> 
    </div>
  );
}

export default App;
