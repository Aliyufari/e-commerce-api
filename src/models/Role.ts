import { model, Schema } from "mongoose";
import { RoleInterface } from "../types";

const roleSchema = new Schema<RoleInterface>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    permissions: [{
      type: Schema.Types.ObjectId,
      ref: 'Permission'
    }] ,
  },
  {
    timestamps: true
  }
);

// Hide some fields in response
roleSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
        ret.id = ret._id;
        ret.created_at = ret.createdAt;
        ret.updated_at = ret.updatedAt;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;

        return ret;
    }
});
  
export const Role = model<RoleInterface>('Role', roleSchema);