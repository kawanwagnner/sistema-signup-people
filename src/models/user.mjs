import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    user: {
      type: String,
    },
    pass: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    payOrNot: {
      type: String,
      required: true,
    },
    endereco: {
      type: String,
      required: true,
    },
    quantidade: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

// Exportei para o mundo lá fora...
export default mongoose.model("User", userSchema);
