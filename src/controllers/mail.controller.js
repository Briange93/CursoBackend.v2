import nodemailer from 'nodemailer';
import config from '../config/enviroment.config.js'


const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAccountPassword
      }   
});
transport.verify(function(error, success){
    if(error){
        console.log(error);
    }else{
        console.log('Server is ready to take our messages');
    }
});

const mailOptions = {
    from: 'Brian Gilmour BackEnd<' + config.gmailAccount + '>',
    to: 'briangilmour93@gmail.com',
    subject: "Recibo de compra",
    html: `<div>
                         <h2>Este es tu recibo</h2>
                         <h1>Gracias por tu compra</h1>
                   </div>`,
    attachments: [] 
}

   export  const sendMail = (req,res) =>{
        try{
             transport.sendMail(mailOptions, (error,info)=>{
                if(error){
                    console.log(error);
                    res.status(400).send({msg: 'error', payload: error})
                }
                console.log('Message sent: %s', info.messageId);
                res.send({message:'success', payload:info})
             })
        }
        catch(error){
            console.log(error);
            res.status(500).send({error:error,message:"no se pudo enviar email desde: " + config.gmailAccount}) 
        }
    }
    
