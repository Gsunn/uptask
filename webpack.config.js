const path = require('path')        //permite el acceso al sistema de archivos
const webpack = require('webpack')

//recibe el fihero en la entrada y crea otro en la salida indicada
//configuracion de babel - webpack
module.exports = {
    entry: './public/js/app.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, './public/dist') 
    },
    module:{
        rules:[
            {
                //js
                test: /\.m?js$/,
                use:{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}