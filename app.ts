import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import Logger from './logger';

dotenv.config();

const logger = new Logger();

const storage = multer.diskStorage(
    {
        destination: (req,file, cb) => {
            const regexp = /^\d+-\d+\.pdf$/;            
            const folder: string = regexp.test(file.originalname) ? process.env.BOLETOLOCALPATH! : process.env.DANFELOCALPATH!;
            cb(null,folder!);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    }
)

const upload = multer({storage: storage});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req,res)=> {
    res.send(`Server is running!`);
});

app.post('/danfe', upload.single('danfe'), (req,res)=>{
    if(!req.file) {
        logger.warn('Arquivo ausente na requisição');
    }

    logger.info(`Arquivo salvo com sucesso: ${req.file?.originalname}`);
    res.send(`Arquivo salvo com sucesso: ${req.file?.originalname}`);
});

app.listen(process.env.PORT, ()=>{
    logger.info(`Serviço iniciado com sucesso!`)
    console.log(`Server is running at ${process.env.HOSTURL}:${process.env.PORT}`);  
});


