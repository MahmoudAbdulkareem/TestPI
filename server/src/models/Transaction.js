const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    anomalie: { type: Boolean, default: false },
    commentaireAnomalie: { type: String, default: "" },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    compteBancaire: { type: String, required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ipAddress: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, default: Date.now },
    __v: { type: Number, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
