import { HttpStatus } from "../enums/HttpStatus";
import { HttpStatusCode } from "../enums/HttpStatusCode";

export class ApiResponse<T> {
    private timeStamp: string;
    private statusCode: HttpStatusCode;
    private status: HttpStatus;
    private message: string;
    
    constructor(
        statusCode: HttpStatusCode, 
        status: HttpStatus, 
        message: string, 
        key?: string,
        data?: T | T[] | any
    ){
        this.timeStamp = new Date().toLocaleString();
        this.statusCode = statusCode;
        this.status =status;
        this.message = message;
        

        if (key && data !== undefined) {
            (this as any)[key] = data;
        }
    }
}