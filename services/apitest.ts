import axios from 'axios'

//para inicializar: json-server --watch db.json
export const apitest = axios.create({
  baseURL: "http://localhost:3000"
})