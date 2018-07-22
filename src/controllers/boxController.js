import mongoose from 'mongoose';
import { BoxSchema,
    DeviceSchema } from '../models/boxModel';

const Box = mongoose.model('Box', BoxSchema);
const Device = mongoose.model('devices', DeviceSchema);

export const addNewBox = (req, res) => {
    let newBox = new Box(req.body);
    console.log(req.body);
    newBox.save((err, box) => {
        if (err) {
            res.status(500)
            res.send(err);
        }
        res.json(box);
    });
};

export const getBox = (req, res) => {
    console.log(req.user.serial_number);
    Box.findOne({ serial_number : req.user.serial_number }, (err, box) => {
        if (err) {
            res.send(err);
        }
        res.json(box);
    });
};

export const findById = (id, fn) =>{
Box.findById(id, (err, box) => {
    if(box !=undefined){
        return fn(null,box);
    }
    return fn(new Error('User ' + id + ' does not exist'));
});
};

export const findBySn = (SN, fn ) => {
    Box.findOne({serial_number:SN }, (err, box) => {
        if(box !=undefined){
            return fn(null,box);
        } 
        return fn(null, null);
    });
};


export const addDeviceData= (req,res) => {

Device.update({
    serial_number : req.body.serial_number,
    box_serial_number : req.body.box_serial_number
                },
    {$push:
         {record:{'energy_consum' : req.body.record[0].energy_consum }}},           
    (err, device) => {
    if (err) {
        res.status(500)
        res.send(err);  
    }
 
    res.json(device);
});
}

export const addDevice= (req,res) => {
    Box.update({ serial_number : req.body.box_serial_number},
               {$push:
                   {
                   device:{ 
                       serial_number :  req.body.serial_number,
                       stat : req.body.stat,
                       device_type:req.body.device_type
                           } 
                   }
               },
            (err, stat) => {
                if (err) {
                    res.status(500)
                    res.send(err);  
                }
                if(stat){

                    let newDevice = new Device(req.body);
                    newDevice.save((err, device) => {
                        if (err) {
                            res.status(500)
                            res.send(err);
                             }
                              res.json(device);
                             });
                }
               
            } );
}


export const getDeviceById = (req,res) => {
console.log("serial_number------",req.params);
    Device.findOne({ box_serial_number : req.user.serial_number,
                     serial_number : req.params.serial_number},
                      (err, device) => {
        if (err) {
            res.send(err);
        }
        res.json(device);
    });
}
