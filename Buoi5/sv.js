const fs = require('fs');
const { DOMParser } = require('xmldom');
const xpath = require('xpath');

// Đọc file XML từ hệ thống file
const xmlString = fs.readFileSync('sv.xml', 'utf-8');

// Phân tích XML thành DOM
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(xmlString, "application/xml");

// Hàm hỗ trợ để lấy kết quả XPath
function getXPathResult(expression, contextNode = xmlDoc, resultType = xpath.XPathResult.ANY_TYPE) {
    return xpath.evaluate(expression, contextNode, null, resultType);
}

// 1. Lấy tất cả sinh viên (trích xuất thông tin id, tên và ngày sinh)
let result = getXPathResult("//student", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("1. Tất cả sinh viên:");
for (let i = 0; i < result.snapshotLength; i++) {
    const student = result.snapshotItem(i);
    const id = xpath.select1("id/text()", student).nodeValue;
    const name = xpath.select1("name/text()", student).nodeValue;
    const date = xpath.select1("date/text()", student).nodeValue;
    console.log(`- ID: ${id}, Tên: ${name}, Ngày sinh: ${date}`);
}

// 2. Liệt kê tên tất cả sinh viên
result = getXPathResult("//student/name", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n2. Tên tất cả sinh viên:");
for (let i = 0; i < result.snapshotLength; i++) {
    console.log(result.snapshotItem(i).textContent);
}

// 3. Lấy tất cả id của sinh viên
result = getXPathResult("//student/id", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n3. ID của tất cả sinh viên:");
for (let i = 0; i < result.snapshotLength; i++) {
    console.log(result.snapshotItem(i).textContent);
}

// 4. Lấy ngày sinh của sinh viên có id = "SV01"
result = getXPathResult("//student[id='SV01']/date", xmlDoc, xpath.XPathResult.FIRST_ORDERED_NODE_TYPE);
console.log("\n4. Ngày sinh của SV01:", result.singleNodeValue ? result.singleNodeValue.textContent : "Not found");

// 5. Lấy các khóa học
result = getXPathResult("//enrollment/course", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n5. Các khóa học:");
for (let i = 0; i < result.snapshotLength; i++) {
    console.log(result.snapshotItem(i).textContent);
}

// 6. Lấy toàn bộ thông tin của sinh viên đầu tiên (trích xuất thông tin)
result = getXPathResult("/school/student[1]", xmlDoc, xpath.XPathResult.FIRST_ORDERED_NODE_TYPE);
console.log("\n6. Toàn bộ thông tin của sinh viên đầu tiên:");
if (result.singleNodeValue) {
    const student = result.singleNodeValue;
    const id = xpath.select1("id/text()", student).nodeValue;
    const name = xpath.select1("name/text()", student).nodeValue;
    const date = xpath.select1("date/text()", student).nodeValue;
    console.log(`- ID: ${id}, Tên: ${name}, Ngày sinh: ${date}`);
} else {
    console.log("Not found");
}

// 7. Lấy mã sinh viên đăng ký khóa học "Vatly203"
result = getXPathResult("//enrollment[course='Vatly203']/studentRef", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n7. Mã sinh viên đăng ký khóa học Vatly203:");
for (let i = 0; i < result.snapshotLength; i++) {
    console.log(result.snapshotItem(i).textContent);
}

// 8. Lấy tên sinh viên học môn "Toan101"
result = getXPathResult("//enrollment[course='Toan101']/preceding::student[1]/name", xmlDoc, xpath.XPathResult.FIRST_ORDERED_NODE_TYPE);
console.log("\n8. Tên sinh viên học môn Toan101:", result.singleNodeValue ? result.singleNodeValue.textContent : "Not found");

// 9. Lấy tên sinh viên học môn "Vatly203"
result = getXPathResult("//enrollment[course='Vatly203']/preceding::student[1]/name", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n9. Tên sinh viên học môn Vatly203:");
for (let i = 0; i < result.snapshotLength; i++) {
    console.log(result.snapshotItem(i).textContent);
}

// 10. Lấy ngày sinh của sinh viên có id="SV01"
result = getXPathResult("//student[id='SV01']/date", xmlDoc, xpath.XPathResult.FIRST_ORDERED_NODE_TYPE);
console.log("\n10. Ngày sinh của SV01:", result.singleNodeValue ? result.singleNodeValue.textContent : "Not found");

// 11. Lấy tên và ngày sinh của mọi sinh viên sinh năm 1997
result = getXPathResult("//student[substring(date, 1, 4)='1997']", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n11. Tên và ngày sinh của sinh viên sinh năm 1997:");
for (let i = 0; i < result.snapshotLength; i++) {
    const student = result.snapshotItem(i);
    const name = xpath.select1("name/text()", student).nodeValue;
    const date = xpath.select1("date/text()", student).nodeValue;
    console.log(`- Tên: ${name}, Ngày sinh: ${date}`);
}

// 12. Lấy tên của các sinh viên có ngày sinh trước năm 1998
result = getXPathResult("//student[substring(date, 1, 4) < '1998']/name", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n12. Tên của các sinh viên có ngày sinh trước năm 1998:");
for (let i = 0; i < result.snapshotLength; i++) {
    console.log(result.snapshotItem(i).textContent);
}

// 13. Đếm tổng số sinh viên
result = getXPathResult("count(//student)", xmlDoc, xpath.XPathResult.NUMBER_TYPE);
console.log("\n13. Tổng số sinh viên:", result.numberValue);

// 14. Lấy tất cả sinh viên chưa đăng ký môn nào (trích xuất thông tin)
result = getXPathResult("//student[not(id = //enrollment/studentRef)]", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n14. Sinh viên chưa đăng ký môn nào:");
for (let i = 0; i < result.snapshotLength; i++) {
    const student = result.snapshotItem(i);
    const id = xpath.select1("id/text()", student).nodeValue;
    const name = xpath.select1("name/text()", student).nodeValue;
    const date = xpath.select1("date/text()", student).nodeValue;
    console.log(`- ID: ${id}, Tên: ${name}, Ngày sinh: ${date}`);
}

// 15. Lấy phần tử <date> anh em ngay sau <name> của SV01
result = getXPathResult("//student[id='SV01']/name/following-sibling::date[1]", xmlDoc, xpath.XPathResult.FIRST_ORDERED_NODE_TYPE);
console.log("\n15. Phần tử <date> anh em ngay sau <name> của SV01:", result.singleNodeValue ? result.singleNodeValue.textContent : "Not found");

// 16. Lấy phần tử <id> anh em ngay trước <name> của SV02
result = getXPathResult("//student[id='SV02']/name/preceding-sibling::id[1]", xmlDoc, xpath.XPathResult.FIRST_ORDERED_NODE_TYPE);
console.log("\n16. Phần tử <id> anh em ngay trước <name> của SV02:", result.singleNodeValue ? result.singleNodeValue.textContent : "Not found");

// 17. Lấy toàn bộ node <course> trong cùng một <enrollment> với studentRef='SV03'
result = getXPathResult("//enrollment[studentRef='SV03']/course", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n17. Node <course> trong enrollment với studentRef='SV03':");
for (let i = 0; i < result.snapshotLength; i++) {
    console.log(result.snapshotItem(i).textContent);
}

// 18. Lấy sinh viên có họ là “Trần” (không có trong file mới, bỏ qua)
result = getXPathResult("//student[starts-with(name, 'Trần')]", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n18. Sinh viên có họ là Trần:");
for (let i = 0; i < result.snapshotLength; i++) {
    const student = result.snapshotItem(i);
    const name = xpath.select1("name/text()", student).nodeValue;
    const date = xpath.select1("date/text()", student).nodeValue;
    console.log(`- Tên: ${name}, Ngày sinh: ${date}`);
}

// 19. Lấy năm sinh của sinh viên SV01
result = getXPathResult("substring(//student[id='SV01']/date, 1, 4)", xmlDoc, xpath.XPathResult.STRING_TYPE);
console.log("\n19. Năm sinh của SV01:", result.stringValue);