import React from 'react'

// Form a message object to be inserted into the field
const Messages = ({ messages, name }) => {
    
  return (
    <div>
        {messages.map(({user, message}, index) => {
            const userName = user && user.name ? user.name : user;
            return (
                <div key={index} className='flex flex-col border-2 
                border-gray-500 w-fit rounded-xl bg-gray-500 m-4'>
                    <span className='font-bold mx-2 my-1 text-teal-400'>
                        {userName}
                    </span>
                    <span className='mx-2 pb-2 text-white'>
                        {message}
                    </span>
                </div>
            )
        })}
    </div>
  )
}

export default Messages