import { Link } from 'react-router-dom';
import { useState } from 'react';

const FIELDS = {
    NAME: 'name',
    ROOM: 'room'
}

const Main = () => {
    const { NAME, ROOM } = FIELDS;

    const isAscii = (str) => /^[\x00-\x7F]*$/.test(str);

    const [values, setValues] = useState({[NAME]: "", [ROOM]: ""});

    const handleChange = ({ target: { value, name } }) => {
        setValues({ ...values, [name]: value });
    }
    
    const handleClick = (e) => {
        // Check the data according to the task and issue a message if it does not fit. 
        const isDisabled = Object.values(values).some(value => !value);
        const isAscii = Object.values(values).some(value => !/^[\x00-\x7F]*$/.test(value));
        const isNameTooLong = values[NAME].length > 32;
        const isRoomTooLong = values[ROOM].length > 64;
        if (isDisabled || isAscii || isNameTooLong || isRoomTooLong) {
            e.preventDefault();
            let errorMessage = '';
            if (isDisabled) {
                errorMessage += 'Please fill in all fields.\n';
            }
            if (isAscii) {
                errorMessage += 'Please use only ASCII characters.\n';
            }
            if (isNameTooLong) {
                errorMessage += 'Name should not be longer than 32 characters.\n';
            }
            if (isRoomTooLong) {
                errorMessage += 'Room ID should not be longer than 64 characters.\n';
            }
            alert(errorMessage.trim());
        }
    }

    return (
        <div>
        <div className='flex text-gray-500 font-bold 
        text-5xl justify-center items-end h-[30vh] mb-12'>
            Join Chatroom
        </div>
        <form autoComplete="off">
            <div className='flex justify-center items-center
            border-white mb-6'>
                <input 
                type="text" 
                name="name"
                placeholder='Username' 
                value={values[NAME]}
                required
                onChange={handleChange}
                className='border-gray-500 p-2 rounded text-white 
                border-3 w-[15vw] min-w-[200px] outline-none text-2xl' />
            </div>
            <div className='flex justify-center items-center
            border-white'>
                <input 
                type="text" 
                name="room"
                placeholder='Room ID' 
                value={values[ROOM]}
                required
                onChange={handleChange}
                className='border-gray-500 p-2 rounded text-white 
                border-3 w-[15vw] min-w-[200px] outline-none text-2xl' />
            </div>
            <div className='flex justify-center items-center mt-12'>
                <Link
                onClick={handleClick} 
                to={`/chat?name=${values[NAME]}&room=${values[ROOM]}`}>
                    <button type='submit' className='border-3 border-gray-500
                    px-6 py-2 text-2xl rounded text-gray-500 cursor-pointer
                    font-bold hover:bg-gray-500 hover:text-white'> 
                        Sign in
                    </button>
                </Link>
        </div>
        </form>
        </div>
    );
};

export default Main;