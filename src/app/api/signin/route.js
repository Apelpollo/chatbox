import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import User from '@/models/User'; 
import bcrypt from 'bcrypt';
import connectToDatabase from "@/lib/db";
import { EmailTemplate } from '@/components/email-template';
import { Resend } from 'resend';
import { generateToken } from '@/lib/hash'

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  connectToDatabase()
  try {
    const { email, password } = await req.json(); 

    const user = await User.findOne({ email: email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    
    let token = await generateToken();
    await User.updateOne({email: user.email}, {$set: {twoFactorSecret: token}});

    
      const { data, error } = await resend.emails.send({
        from: 'Auth <auth@chatbox.website>',
        to: [user.email],
        subject: 'Chatbox Auth',
        react: EmailTemplate({ token: token }),
      });
    console.log(data, error)

    
  
    const oneDay = 24 * 60 * 60 * 1000;
    cookies().set('loged', user.email, { expires: Date.now() + oneDay }); 
    return NextResponse.json({ signin: 'Valid credentials' }, { status: 200 });


  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}




export async function GET(){
  const cookieStore = cookies()
  const isLoged = cookieStore.has('loged')
  const isAuth = cookieStore.has('authenticated')
  
  
  if(isLoged == true && isAuth == true){
      return NextResponse.json({ signin: 'Valid Authentication' }, { status: 200 });
  }else{return NextResponse.json({ error: 'forbidden' }, { status: 403 });}
}

