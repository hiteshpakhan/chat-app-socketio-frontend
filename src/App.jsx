import React, { useEffect, useState } from 'react'
import io from "socket.io-client"

const socket = io("https://hitesh.onrender.com")

const App = () => {

  const [userName, setUserName] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(()=>{
    socket.on("recived-message", (message) => {
      setMessages([...messages, message]);
    })
    console.log(messages);
  }, [messages, socket])

  const handleSubmit = (e) => {
    e.preventDefault();

    const messageData = {
      message: newMessage,
      user: userName,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() 
    }

    if(!newMessage == ""){
      socket.emit("send-message", messageData);
      setNewMessage("");
    }else{
      alert("message cannot empty");
    }

  }
  
  return (
    <>
    <div className='w-screen h-screen flex justify-center items-center'>
      {
        chatActive ? (
        <div className='rounded-md w-full md:w-[80vw] lg:w-[30vw] mx-auto backdrop-blur-md shadow-xl p-2 pr-0'>
          <h1 className='text-center font-bold text-xl my-2 uppercase'>Squad Chat</h1>
          <div className='overflow-y-scroll h-[80vh] lg:h-60vh'>
            {
              messages.map((message, index) => {
                return(
                <div key={index} className={`flex rounded-md shadow-md my-5 w-fit ${userName == message.user && "ml-auto"}`} >
                  <div className='bg-green-400 flex justify-center item-center rounded-l-md'>
                    <h3 className='font-bold text-lg px-2'>{message.user.charAt(0).toUpperCase()}</h3>
                  </div>
                  <div className='px-2 bg-white rounded-md mr-2'>
                    <span className='text-sm'>{message.user}</span>
                    <h3 className='font-bold'>{message.message}</h3>
                    <h3 className='text-xs text-right'>{message.time}</h3>
                  </div>
                </div>
                )
              })
            }
          </div>
          <form className='flex gap-2 md:gap-4 justify-between  p-3' onSubmit={handleSubmit}>
            <input type="text"
            placeholder='type your message...'
            className='rounded-md border-2 outline-none px-3 py-3 w-full'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)} />
            <button type='submit' className='px-3 bg-green-500 text-white rounded-md font-bold'>Send</button>
          </form>
        </div>
        ) : (<div className='w-screen h-screen flex justify-center items-center gap-2'>
          <input type="text" 
          value={userName} 
          onChange={(e) => setUserName(e.target.value)} 
          className='text-center px-3 py-2 outline-none border-2 rounded-md' />
          <button type='submit' 
          onClick={() => !userName == "" && setChatActive(true)} 
          className='bg-green-500 text-white px-3 py-2 rounded-md' >Start Chat</button>
        </div>) 
      }
    </div>
    </>
  )
}

export default App