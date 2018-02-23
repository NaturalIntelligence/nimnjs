var dataType = {
    STRING : { value: 1},
    NUMBER : { value: 2},
    DATE : { value: 3},
    BOOLEAN : { value: 4},
    OBJECT : { value: 5},
    ARRAY : { value: 6},
    getType(str){
        switch(str){
            case "string": return dataType.STRING;
            case "number": return dataType.NUMBER;
            case "date": return dataType.DATE;
            case "boolean": return dataType.BOOLEAN;
            case "object": return dataType.OBJECT;
            case "array": return dataType.ARRAY;
        }
    }
}

exports.dataType = dataType;