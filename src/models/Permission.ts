import { model, Schema } from "mongoose";
import { PermissionInterface } from "../types";

const permissionSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true 
    }
});

export const Permission = model<PermissionInterface>('Permission', permissionSchema);