import { model, Schema } from "mongoose";
import { RoleInterface } from "../types";

const roleSchema = new Schema<RoleInterface>({
    name: {
      type: String,
      required: true,
      unique: true
    },
    permissions: [{
        type: Schema.Types.ObjectId,
        ref: 'Permission'
    }] 
});
  
export const Role = model<RoleInterface>('Role', roleSchema);