import { ticketManager }  from '../services/factory.js';
import config from '../config/enviroment.config.js';
const ticketController = async (req, res) => {
    const tid = req.params.tid;
    const ticketData = await ticketManager.loadTicket(tid);
    res.render('ticket', { ticket: ticketData });
}
try {
    fetch ('http://localhost:' + config.port + '/mail', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            to: ticketData.purchaser,
            subject: asunto,
            html: cuerpo
        })
    });
}
    catch (error) {   
        console.error(`${new Date().toLocaleString()}: Error al enviar el mail: ${error}`);
    }

export { ticketController }