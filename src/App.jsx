import React, { useState } from 'react'
import axios from 'axios';

const App = () => {

  const [prompt, setPrompt] = useState("");
  const [colors, setColors] = useState([]);
  const [Loading, setLoading] = useState(false);

  const handleGenerate = async() => {
    setLoading(true);
    setColors([]);

    try {

      const response = await axios.post (
         'https://openrouter.ai/api/v1/chat/completions',
         {
          model: "nousresearch/deephermes-3-llama-3-8b-preview:free",
          messages: [
            {
              role: "user",
              content: `Give me the 5 Hexadecimal colors for : ${prompt}`
            }
          ]
         },
         {
          headers: {
            Authorization: `Bearer ${import.meta.env.api_key}`,
            'Content-Type': 'application/json'
          }
         }
      )

      const resultText = response.data.choices[0].message.content;
      
      const hexMatches = resultText.match(/#[A-Fa-f0-9]{6}/g);
      
      if (hexMatches) 
          setColors(hexMatches);
      
          

    } catch (err) {
      console.log("Error: ", err.response?.data || err.message);
      setColors("#FA7845", "E6FGBA", "#HJ7863");
    } finally {
      setLoading(false);
      setPrompt("");
    }

  }

  return (
    <div className='bg-[#1E1B4B] min-h-screen text-white flex flex-col items-center justify-center
    px-4 py-10'>
      <h1 className='text-4xl font-bold mb-4 text-center'>AI Color Palette</h1>

      <input type="text"
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      className='w-full max-w-md border p-3 rounded-md bg-[#2A265F] text-white mb-4'
      placeholder='Enter your brand / mood (e.g sun, moon)'
      />

      <button className='bg-[#10B981] px-6 py-2 rounded hover:bg-[#059669]'
      disabled={Loading}
      onClick={handleGenerate}>
        {Loading? "Generating..." : "Generate Palette"}
      </button>

      {/* result */}
       
      {colors.length > 0 && (
        <div className='grid grid-cols-2 sm:grid-cols-3 sm:grid-cols-5 gap-5 mt-10'>
          {colors.map((color,idx) => (
            <div key={idx} className='flex flex-col items-center'>
              <div className='w-20 h-20 rounded-lg shadow' style={{
                backgroundColor:color
              }}></div>
              <span className='mt-3'>{color}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default App