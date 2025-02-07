import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { FaRegSmileBeam } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";
import Messages from './Messages';

const socket = io.connect('http://localhost:4500');

const Chat = () => {
    const { search } = useLocation();
    const navigate = useNavigate()
    const [params, setParams] = useState({ room: '', user: ''});
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);

    // Extracts query parameters from the URL, updates state, and emits a 'join' event to the server.
    useEffect(() => {
        const searchParams = Object.fromEntries(new URLSearchParams(search));
        setParams(searchParams);
        socket.emit('join', searchParams);
    }, [search]);

    // Listens for 'messageHistory' and 'message' events from the server, 
    // updates state, and cleans up event listeners on component unmount.
    useEffect(() => {
      socket.on("messageHistory", (messages) => {
          setMessages(messages);
      });
  
      socket.on("message", ({ data }) => {
          setMessages((prevMessages) => [...prevMessages, data]);
      });
  
      return () => {
          socket.off("messageHistory");
          socket.off("message");
      };
  }, []);

  const leftRoom = () => {
    socket.emit('leftRoom', { params });
    navigate('/')
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!message) return;
    console.log("Отправка сообщения:", message, params);
    socket.emit('sendMessage', { message, params })
    setMessage("");
  };
  const handleChange = ({ target: { value }}) => setMessage(value);
  const onEmojiClick = ({emoji}) => setMessage(`${message} ${emoji}`);

  return (
    <div>
      <div className='flex w-full justify-between py-10 px-60'>
        <div className='text-white text-5xl font-bold'>{params?.room || 'Room is not defined'}</div>
        <div>
        <button 
        type='submit'
        onClick={leftRoom} 
        className='border-3 border-gray-500
        px-6 py-2 text-2xl rounded text-gray-500 cursor-pointer
        font-bold hover:bg-gray-500 hover:text-white'> 
        Left the room
        </button>
        </div>
      </div>
      <div className='flex justify-center items-center w-full h-[60vh] overflow-y-auto'>
        <div className='w-[50%]'>
          <Messages messages={messages} name={params.name} />
        </div>
      </div>
      <form className='flex justify-center items-center border-white absolute bottom-10 w-full'>
      <input 
        type="text" 
        name="message"
        placeholder='You message' 
        value={message}
        onChange={handleChange}
        className='border-gray-500 p-2 rounded text-white 
        border-3 w-[25vw] min-w-[200px] outline-none text-2xl' />
        <div>
          <div 
          className='text-gray-500 text-4xl px-10 cursor-pointer'
          onClick={() => setOpen(!open)}>
            <FaRegSmileBeam />
          </div>
          {open && (
          <div className='absolute bottom-20 right-[30%]'>
            <EmojiPicker onEmojiClick={onEmojiClick} theme={Theme.DARK} />
          </div>
          )}
        </div>
        <button 
        className='text-gray-500 text-4xl cursor-pointer'
        type='submit' 
        onClick={handleSubmit} 
        value='Send a message'>
          <FaTelegram />
        </button>
      </form>
    </div>
  )
};


export default Chat