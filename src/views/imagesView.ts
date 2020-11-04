import Image from '../models/Image'

export default {
  render(image: Image) {
    return {
      id: image.id,
      url: `http://localhost:3333/uploads/${image.path}` //é uma boa deixar a url base como variável de ambiente no dotenv
    }
  },

  renderMany(image: Image[]) {
    return image.map(image => this.render(image))
  }
}