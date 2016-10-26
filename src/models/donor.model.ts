import * as mongoose from "mongoose";

export interface IDonor {
    _id:            any;
    ip:             string;
    firstName:      string;
    lastName:       string;
    contactNumber:  string;
    emailAddress:   string;
    bloodGroup:     string;
    address:        any;
    location:       any;
}

export interface IDonorModel extends IDonor, mongoose.Document {}

export var DonorSchema = new mongoose.Schema({
    ip:             String,
    firstName:      String,
    lastName:       String,
    contactNumber:  {type: String, unique: true},
    emailAddress:   {type: String, unique: true},
    bloodGroup:     String,
    address:        mongoose.Schema.Types.Mixed,
    location:       mongoose.Schema.Types.Mixed

});

export var Donor = mongoose.model<IDonorModel>("Donor", DonorSchema);
