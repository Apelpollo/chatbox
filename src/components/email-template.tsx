import * as React from 'react';
interface EmailTemplateProps {
  token: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  token,
}) => (
  <div className='bg-grey flex justify-between items-center '>
    <img src='https://i.imgur.com/1alqVrq.png' width={100} height={100}></img>
    <h1 className='text-white font-bold text-xl'>Welcome!</h1>
    <h1 className='text-white font-bold text-xxl'>Your auth token is: {token}</h1>
  </div>
);
