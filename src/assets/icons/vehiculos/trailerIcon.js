export const trailerIcon = (tipo_id) => {
    switch (tipo_id) {
        case 2:
            return require('./trailers/2.png')
        case 6:
            return require('./trailers/6.png')
        case 7:
            return require('./trailers/7.png')
        case 8:
            return require('./trailers/8.png')
        case 10:
            return require('./trailers/10.png')
        case 12:
            return require('./trailers/12.png')
        case 14:
            return require('./trailers/14.png')
        case 16:
            return require('./trailers/16.png')
        case 19:
            return require('./trailers/19.png')
        case 21:
            return require('./trailers/21.png')
        case 22:
            return require('./trailers/22.png')
        case 23:
            return require('./trailers/23.png')
        default:
            return require('./trailers/2.png')
    }
}