export const vehicleIcon = (tipo_id) => {
    switch (tipo_id) {
        case 1:
            return require('./vehiculos/1.png')
        case 2:
            return require('./vehiculos/2.png')
        case 3:
            return require('./vehiculos/3.png')
        case 4:
            return require('./vehiculos/4.png')
        case 5:
            return require('./vehiculos/5.png')
        case 6:
            return require('./vehiculos/6.png')
        case 7:
            return require('./vehiculos/7.png')
        default:
            return require('./vehiculos/1.png')
    }
}
