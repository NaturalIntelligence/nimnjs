var dataType = {
    STRING : { value: 1},
    NUMBER : { value: 2},
    DATE : { value: 3},
    BOOLEAN : { value: 4},
    getType(str){
        switch(str){
            case "string": return dataType.STRING;
            case "number": return dataType.NUMBER;
            case "date": return dataType.DATE;
            case "boolean": return dataType.BOOLEAN;
        }
    },
    getInstance(str){
        return new DataType(dataType.getType(str));
    }
}

function DataType(type){
    this.value = type.value;
    this.parse = type.parse;
    this.parseBack = type.parseBack;
}

exports.dataType = dataType;

