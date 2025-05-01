import { HttpStatus } from "../enums/HttpStatus";
import { HttpStatusCode } from "../enums/HttpStatusCode";

export class ApiResponse {
    private timeStamp;
    constructor(
        private statusCode: HttpStatusCode, 
        private status: HttpStatus, 
        private message: string, 
        private data?: {}
    ){
        this.timeStamp = new Date().toLocaleString();
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
        this.data = data;
    }
}