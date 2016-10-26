import { IDonor, Donor } from "../models";

export class MapSocket {
    private socket: any;
    private nsp: any;
    private remoteAddress: any;


    constructor(private io: any) {
        this.nsp = this.io.of("/map");
        this.nsp.on("connection", (socket: any) => {
            console.log(this.socket);
            this.socket = socket;
            this.remoteAddress = socket.client.conn.remoteAddress;
            this.listen();
            console.log("Client connected [%s]", this.remoteAddress);
        });
    }

    
    // Socket Handler
    private listen(): void {
        this.socket.on("disconnect", () => this.disconnect());
        this.socket.on("addDonor", (donor: IDonor) => this.addDonor(donor));
        this.socket.on("updateDonor", (donor: IDonor) => this.updateDonor(donor));
        this.socket.on("findDonors", (lat: number, log: number) => this.findDonors(lat, log));
        this.socket.on("findMyRegister", () => this.findMyRegister());
        this.socket.on("unsubscribe", (donor: IDonor) => this.unsubscribe(donor));
    }

    // Update donor and broadcast for all connected clients
    private updateDonor(donor: IDonor): void {
        donor.ip = this.remoteAddress; 
        console.log("UPDATING %s", donor.firstName);
        console.log(donor);
        
        Donor.update(donor, (error: any) => {
            let response = {};
            if (error) {
                response = {error: error, message: 'Database error', object: null}; 
                console.log(response);
            } else {
                response = {error: null, message: null, object: donor};
                this.nsp.emit("updatedDoner", donor);
            }
            this.socket.emit("addedDonorResponse", response);
        });
    }

    // Add new donor and broadcast for all connected clients
    private addDonor(donor: IDonor): void {
        donor.ip = this.remoteAddress; 
        console.log("SAVING %s", donor.firstName);
        console.log(donor);
        Donor.create(donor, (error: any, donor: IDonor) => {
            let response = {};
            if (error) {
                response = {error: error, message: 'Database error', object: null}; 
                console.log(response);
            } else {
                response = {error: null, message: null, object: donor};
                this.nsp.emit("addedDonor", donor);
            }
            this.socket.emit("addedDonorResponse", response);
        });
    }

    // Delete donor and broadcast for all connected clients
    private unsubscribe(donor: IDonor): void {
        Donor.remove({ _id: donor._id }, (error: any) => {
            if (error) {
                console.log(error);
            } else {
                this.nsp.emit("unsubscribed", donor);
            }
        });
    }

    // Find donors and return for the client
    private findDonors(lat: number, log: number): void {
        // TODO: create a query fintering by geolocation proximity
        let variation     = 1000;
        let latitudeMin   = lat - variation;
        let latitudeMax   = lat + variation;
        let longitudeMin  = log - variation;
        let longitudeMax  = log + variation;

        Donor.find(
          {
            $or: [
              {"latitude" : {$gt: latitudeMin, $lt: latitudeMax}},
              {"longitude" : {$gt: longitudeMin, $lt: longitudeMax}}
            ]
          }
        );
        Donor.find().exec((error: any, donors: IDonor[]) => {
            if (!error && donors) {
                this.socket.emit("findedDonorsResponse", donors);
            }
        });
    }
  

    private findMyRegister(): void {
        Donor.find({"ip": this.remoteAddress}).limit(1).exec((error: any, donor: IDonor) => {
            if (!error && donor) {
                this.socket.emit("findMyRegisterResponse", donor[0]);
            } else {
                console.log(error);
            }
        });
    }

    
    private disconnect(): void {
        console.log("Client disconnected");
    }
  
}