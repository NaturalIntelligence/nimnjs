const dataType = {
    STRING : 1,
    NUMBER : 2,
    DATE : 3,
    BOOLEAN : 4,
    OBJECT : 5,
    ARRAY : 6,
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