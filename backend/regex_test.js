const regex = /\[[\s\S]*\]|\{[\s\S]*\}/;

const arrayResponse = "Here is your JSON:\n```json\n[\n  {\"id\": 1}\n]\n```\nHope it helps!";
const objectResponse = "Here is the object:\n{\n  \"status\": \"success\"\n}\nHave a nice day!";

console.log("Array Test:", arrayResponse.match(regex)[0]);
console.log("Object Test:", objectResponse.match(regex)[0]);
