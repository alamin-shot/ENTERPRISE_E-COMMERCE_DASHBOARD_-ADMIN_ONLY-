"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const imageSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    url: { type: String, required: true },
    alt: { type: String, default: "" },
    isPrimary: { type: Boolean, default: false },
}, { _id: false });
const dimensionsSchema = new mongoose_1.Schema({
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    unit: { type: String, enum: ["cm", "in"], default: "cm" },
}, { _id: false });
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, default: null },
    sku: { type: String, required: true, unique: true, uppercase: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    category: {
        type: String,
        enum: [
            "electronics",
            "clothing",
            "food",
            "furniture",
            "sports",
            "beauty",
            "other",
        ],
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive", "draft", "archived"],
        default: "draft",
    },
    images: { type: [imageSchema], default: [] },
    tags: { type: [String], default: [] },
    weight: { type: Number, default: null },
    dimensions: { type: dimensionsSchema, default: null },
}, { timestamps: true });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ name: "text", description: "text" });
exports.Product = mongoose_1.default.model("Product", productSchema);
