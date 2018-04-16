export function FormDataToJSON(FormElement){
    let object = {};
    FormElement.forEach(function(value, key){
        object[key] = value;
    });
    return object;
}

export function getAPIDataUrl() {
    let localhost = false;
    if(localhost)
        return "http://192.168.1.10/qrcontestv2/dataapi/request.php";
    return "./dataapi/request.php";
}