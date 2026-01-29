const {constants} = require("../constant");
const errorHandler = (err, req, res, next) =>{
    const statusCode = res.statusCode ? res.statusCode : 500;
    switch (statusCode) {
        case constants.VALIDDATION_ERROR:
            res.json({title: "Validation Failed", message: err.message, stackTrace: err.stack});
            break;
        case constants.NOT_FOUND:
            res.json({title: "Not Found", message: err.message, stackTrace: err.stack});
            break;
        case constants.UNAUTHORIZED:
            res.json({title: "UNAUTHORIZED", message: err.message, stackTrace: err.stack});
            break;
        case constants.FORBOIDDEN:
            res.json({title: "FORBOIDDEN", message: err.message, stackTrace: err.stack});
            break;
        case constants.SERVER_ERROR:
            res.json({title: "Server Error", message: err.message, stackTrace: err.stack});
            break;
        default:
            console.log("No Error, All Good!")
            break;
    }
    
};

module.exports = errorHandler;