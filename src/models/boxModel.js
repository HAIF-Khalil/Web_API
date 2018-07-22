import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const BoxSchema = new Schema({
    serial_number: {
        type: Number,
        required: '\'serial_number\' is Missing',
        unique: 'serial number unique'
    },
    password: {
        type: String,
        required: '\'password\' is Missing'
    },
    phone: {
        type: String
    },
    device:[
        {
            serial_number:{ type: Number,  required: ' Device \'serial_number\' is Missing'},
            stat:{ type:Number, required:'Device \'stat\'is  Missing'},
            device_type:Number
        }
    ] ,
    phone: {
        type: Number
    }
    
});

export const DeviceSchema = new Schema({
    serial_number: {
        type: Number,
        required: '\'serial_number\' is Missing'
    },
    box_serial_number:{
        type: Number,
        required: '\'box_serial_number\' is Missing'
    },
    stat:Number,
    device_type:Number,
    record:[
    {
        created_date: {
            type: Date,
            default: Date.now 
         },
         energy_consum:Number
    }]
});
