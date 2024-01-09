const mongoose = require('mongoose');

module.exports = mongoose.model('customer', new mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: Number,
        trim: true,
        // match: '^\+998([- ])?(90|91|93|94|95|98|99|33|97|71)([- ])?(\d{3})([- ])?(\d{2})([- ])?(\d{2})$',
        required: [true, 'Phone number required'],
    },
    img: {
        type: String,
        trim: true,
        default: null
    },
    address: {
        type: String,
        minlength: 2,
        maxlength: 100,
        required: true
    },
    balance: {
        type: Number,
        default: null
    },
    role: {
        type: String,
        minlength: 2,
        maxlength: 10,
        enum: ['customer', 'admin', 'boss'],
        lowercase: true,
        default: 'customer'
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: value => {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Invalid email address format',
        },
        required: true
    },
    password: {
        type: String,
        minlength: 4,
        maxlength: 200,
        // validate: {
        //     validator: (pswd) => {
        //       return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/.test(pswd);
        //     },
        //     message: props => `${props.value} is not a valid password!`
        // },
        required: true
    }
}, {timestamps: true, versionKey: false}));