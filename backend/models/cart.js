const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    sessionId: {
        type: String,
        default: null
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            image: {
                type: String,
                default: ''
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            },
            unitPrice: {
                type: Number,
                required: true,
                default: 0
            },
            selectedOptions: {
                size: String,
                flavor: String,
                filling: String,
                customMessage: {
                    type: String,
                    maxlength: 200
                },
                customizations: [
                    {
                        name: String,
                        type: {
                            type: String,
                            enum: ['size', 'flavor', 'filling', 'message']
                        },
                        label: String,
                        priceAdjustment: {
                            type: Number,
                            default: 0
                        }
                    }
                ]
            },
            addOns: [
                {
                    addOn: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'AddOn',
                        required: true
                    },
                    name: String,
                    price: {
                        type: Number,
                        min: 0
                    },
                    quantity: {
                        type: Number,
                        min: 1,
                        default: 1
                    }
                }
            ],
            subtotal: {
                type: Number,
                required: true,
                default: 0
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cart', cartSchema);
