module.exports = {
    NO : 0,                                // Boolean No
    YES : 1,                               // Boolean Yes
    HAS_META_FIELD : 2,          // An Object with 2 fields. No extra byte to specify length. maps.
    BYTE : 3,                             // 1 Byte data. Suitable for enum, char
    FLOAT : 4,                           // 3 field data. 1st boolean, 2nd & 3rd is LINKED_BYTES
    HAS_DATA_LENGTH : 5,      // Data with extra byte to specify length of the data. Suitable for list of enums and string
    HAS_FIELDS_COUNT : 6,     // Data with extra byte to specify count of fields of the data. Suitable for objects
    LINKED_BYTES : 7               // 128 bits data. MSB specify if next bit is data bit. Suitable for integer.
}