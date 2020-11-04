import {Request, Response} from 'express'
import {getRepository} from 'typeorm'
import * as Yup from 'yup'

import orphanageView from '../views/orphanagesView'
import Orphanage from '../models/Orphanage'

export default {
  async index(request: Request, response: Response) {
    const orphanagesRepository = getRepository(Orphanage)

    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    })

    return response.status(200).send(orphanageView.renderMany(orphanages))
  },

  async show(request: Request, response: Response) {
    const {id} = request.params

    const orphanagesRepository = getRepository(Orphanage)

    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images']
    })

    return response.status(200).send(orphanageView.render(orphanage))
  },

  async create(request: Request, response: Response) {
    const {
      name, 
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
      } = request.body
  
    const orphanagesRepository = getRepository(Orphanage)

    const requestImages = request.files as Express.Multer.File[] //esse as é necessário para o upload de múltiplios arquivos devido ao type do multer estar confuso
    const images = requestImages.map((image) => {
      return {path: image.filename}
    })
  
    const data = orphanagesRepository.create({
      name, 
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true',
      images
    })

    const schema = Yup.object().shape({
      name: Yup.string().required('Nome obrigatório'),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
        })
      )
    })

    await schema.validate(data, {
      abortEarly: false
    })
  
    await orphanagesRepository.save(data)
  
    return response.status(201).json({message: "Orphanage created successfully", data})
    
  }
}