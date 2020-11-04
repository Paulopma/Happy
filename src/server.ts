import express from 'express'
import path from 'path'
import cors from 'cors' //necessário para permitir o acesso aos fronts de diferentes urls

import 'express-async-errors'

import './database/connection'

import routes from './routes'
import errorHandler from './errors/handler'

const app = express()

app.use(cors()) //pode ser preenchido com urls específicas que serão liberadas para o acesso da API
app.use(express.json())
app.use(routes)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))
app.use(errorHandler)

app.listen(3333)