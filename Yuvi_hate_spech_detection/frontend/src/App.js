import React, { useState } from "react";
import "./App.css";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const App = () => {
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();

  const [state,setstate]=useState();
  const [ans,setans]=useState("")
  const [text,settext]=useState()
  const startListening = () => {
    setIsListening(true);
    
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    resetTranscript(); // Reset transcript after processing
  };

  const stopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
    console.log(transcript);
    setstate(transcript)
    // You can perform further actions with transcript here
   

  };
  
  if (!SpeechRecognition.browserSupportsSpeechRecognition) {
    return <div>Browser does not support Speech Recognition. Please use a different browser.</div>;
  }

  const fn=(e)=>{
    settext(e.target.value)
  }
  
  const get_ans1=async()=>{
   
    console.log(text)
    const url = "http://localhost:5000/predict";
    const requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        
        body: JSON.stringify({ data:text }) // sending data into backend 
    };

    try {
        const response = await fetch(url, requestOptions);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json(); //getting response inthe form of json format
        const predictionValue = data.Prediction; 
        setans(predictionValue)
       
    } catch (error) {
        console.error('Error:', error);
    }
  }
  const get_ans=async()=>{
    console.log(state)
    console.log(text)
    const url = "http://localhost:5000/predict";
    const requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        
        body: JSON.stringify({ data:state }) // sending data into backend 
    };

    try {
        const response = await fetch(url, requestOptions);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json(); //getting response inthe form of json format
        const predictionValue = data.Prediction; 
        //alert(predictionValue)
        setans(predictionValue)
       
    } catch (error) {
        console.error('Error:', error);
    }
  }
 

  return (
    <div className="container">
       <h2>Hate Speech Detector</h2>
      <input type="text" placeholder="enter any text "  onChange={fn}/><br/>
       <button className="generate_text" onClick={get_ans1} >Generate</button>
      <br />
      <div className="main-content">{transcript}</div>
      <div className="btn-style">
        <button  className="button1"onClick={isListening ? stopListening : startListening}>
          {isListening ? "Stop Listening" : "Start Listening"}
        </button>
        <button className="button2"onClick={get_ans}>Generate ans</button>
      </div>
      
      <div className="hate_speech"><h1> {ans!==""?ans:""}</h1></div>
    </div>
  );
};

export default App;
