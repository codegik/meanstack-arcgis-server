import { IDonor, Donor } from "../models";

export class MapSocket {
    private nsp: any;


    constructor(private io: any) {
        this.nsp = this.io.of("/map");
        this.nsp.on("connection", (socket: any) => {
            this.disconnectHandler(socket);
            this.addDonorHandler(socket);
            this.updateDonorHandler(socket);
            this.findDonorsHandler(socket);
            this.findMyRegisterHandler(socket);
            this.unsubscribeHandler(socket);
            console.log("[%s]: CONNECTED %s", socket.id, socket.client.conn.remoteAddress);
        });
    }
    

    // Update donor and broadcast for all connected clients
    private updateDonorHandler(socket: any): void {
    	socket.on("updateDonor", (donor: IDonor) => {
    		console.log("[%s]: UPDATING %s", socket.id, donor.firstName);
    		
	        donor.ip = socket.client.conn.remoteAddress; 
	        
	        Donor.findOneAndUpdate({emailAddress: donor.emailAddress}, donor, {upsert:true}, (error: any) => {
	            let response = {};
	            if (error) {
	                response = {error: error, message: 'Database error', object: null}; 
	                console.log(response);
	            } else {
	                response = {error: null, message: null, object: donor};
	                socket.broadcast.emit("updatedDoner", donor);
	            }
	            socket.emit("updatedDonerResponse", response);
	        });
    	});
    }

    // Add new donor and broadcast for all connected clients
    private addDonorHandler(socket: any): void {
    	socket.on("addDonor", (donor: IDonor) => {
    		console.log("[%s]: SAVING %s", socket.id, donor.firstName);
    		
	        donor.ip = socket.client.conn.remoteAddress; 
	        Donor.create(donor, (error: any, donor: IDonor) => {
	            let response = {error: null, message: null, object: null};
	            if (error) {
	                response = {error: error, message: 'Database error', object: null}; 
	                console.log(response);
	            } else {
	                response.object = donor;
	                socket.broadcast.emit("addedDonor", donor);
	            }
	            Donor.findOne({emailAddress: donor.emailAddress}).exec((error: any, donor: IDonor) => {
		            if (!error && donor) {
		            	response.object = donor;
		            	socket.emit("addedDonorResponse", response);
		            }
		        });
	        });
    	});
    }

    // Delete donor and broadcast for all connected clients
    private unsubscribeHandler(socket: any): void {
    	socket.on("unsubscribe", (donor: IDonor) => {
    		console.log("[%s]: DELETING %s", socket.id, donor.firstName);
    		
	        Donor.remove({ _id: donor._id }, (error: any) => {
	            if (error) {
	                console.log(error);
	            } else {
	            	socket.broadcast.emit("unsubscribed", donor);
	            	socket.emit("unsubscribed", donor);
	            }
	        });
    	});
    }

    // Find donors and return for the client
    private findDonorsHandler(socket: any): void {
    	socket.on("findDonors", (lat: number, log: number) => {
    		console.log("[%s]: FINDING ALL", socket.id);
    		
	        Donor.find().exec((error: any, donors: IDonor[]) => {
	            if (!error && donors) {
	            	socket.emit("findedDonorsResponse", donors);
	            }
	        });
    	});
    }
  

    private findMyRegisterHandler(socket: any): void {
    	socket.on("findMyRegister", () => {
    		console.log("[%s]: FINDING ONE", socket.id);

	        Donor.find({"ip": socket.client.conn.remoteAddress}).limit(1).exec((error: any, donor: IDonor) => {
	            if (!error && donor) {
	            	socket.emit("findMyRegisterResponse", donor[0]);
	            } else {
	                console.log(error);
	            }
	        });
    	});
    }

    
    private disconnectHandler(socket: any): void {
        socket.on("disconnect", () => {
        	console.log("[%s]: DISCONECTED", socket.id);
        });
    }
  
}