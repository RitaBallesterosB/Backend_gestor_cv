import { connect} from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const connection = async() => {

    try {
        await connect (process.env.MONGODB_URI);
        console.log("Conectado correctamente a db_gestor_cv");
        
    } catch (error) {
        console.log("Error al conectar la DB", error);
        throw new Error ("!No se ha podido conectar al a DB!")
        
    }
}

export default connection;