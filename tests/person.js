'use strict'; // code generated by pbf v3.1.0

// Data ========================================

var Data = exports.Data = {};

Data.read = function (pbf, end) {
    return pbf.readFields(Data._readField, {length: 0, dbl: 0, text: []}, end);
};
Data._readField = function (tag, obj, pbf) {
    if (tag === 1) obj.length = pbf.readDouble();
    else if (tag === 1) obj.dbl = pbf.readDouble();
    else if (tag === 3) obj.text.push(pbf.readString());
};
Data.write = function (obj, pbf) {
    if (obj.length) pbf.writeDoubleField(1, obj.length);
    if (obj.dbl) pbf.writeDoubleField(1, obj.dbl);
    if (obj.text) for (var i = 0; i < obj.text.length; i++) pbf.writeStringField(3, obj.text[i]);
};

// Person ========================================

var Person = exports.Person = {};

Person.read = function (pbf, end) {
    return pbf.readFields(Person._readField, {user_name: "", favourite_number: 0, data: null, interests: [], male: false, dt: 0, size: 0, salary: 0}, end);
};
Person._readField = function (tag, obj, pbf) {
    if (tag === 1) obj.user_name = pbf.readString();
    else if (tag === 2) obj.favourite_number = pbf.readVarint(true);
    else if (tag === 3) obj.data = Data.read(pbf, pbf.readVarint() + pbf.pos);
    else if (tag === 4) obj.interests.push(pbf.readString());
    else if (tag === 5) obj.male = pbf.readBoolean();
    else if (tag === 6) obj.dt = pbf.readVarint(true);
    else if (tag === 7) obj.size = pbf.readVarint();
    else if (tag === 8) obj.salary = pbf.readDouble();
};
Person.write = function (obj, pbf) {
    if (obj.user_name) pbf.writeStringField(1, obj.user_name);
    if (obj.favourite_number) pbf.writeVarintField(2, obj.favourite_number);
    if (obj.data) pbf.writeMessage(3, Data.write, obj.data);
    if (obj.interests) for (var i = 0; i < obj.interests.length; i++) pbf.writeStringField(4, obj.interests[i]);
    if (obj.male) pbf.writeBooleanField(5, obj.male);
    if (obj.dt) pbf.writeVarintField(6, obj.dt);
    if (obj.size) pbf.writeVarintField(7, obj.size);
    if (obj.salary) pbf.writeDoubleField(8, obj.salary);
};

Person.Size = {
    "SMALL": {
        "value": 0,
        "options": {}
    },
    "BIG": {
        "value": 1,
        "options": {}
    }
};
