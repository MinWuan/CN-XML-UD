const fs = require('fs');
const { DOMParser } = require('xmldom');
const xpath = require('xpath');

// Đọc file XML từ hệ thống file
const xmlString = fs.readFileSync('quanlybanan.xml', 'utf-8');

// Phân tích XML thành DOM
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(xmlString, "application/xml");

// Hàm hỗ trợ để lấy kết quả XPath
function getXPathResult(expression, contextNode = xmlDoc, resultType = xpath.XPathResult.ANY_TYPE) {
    return xpath.evaluate(expression, contextNode, null, resultType);
}

// 1. Lấy tất cả bàn
let result = getXPathResult("//BAN", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("1. Tất cả bàn:");
for (let i = 0; i < result.snapshotLength; i++) {
    const ban = result.snapshotItem(i);
    const soBan = xpath.select1("SOBAN/text()", ban).nodeValue;
    const tenBan = xpath.select1("TENBAN/text()", ban).nodeValue;
    console.log(`- Số bàn: ${soBan}, Tên bàn: ${tenBan}`);
}

// 2. Lấy tất cả nhân viên
result = getXPathResult("//NHANVIEN", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n2. Tất cả nhân viên:");
for (let i = 0; i < result.snapshotLength; i++) {
    const nhanVien = result.snapshotItem(i);
    const maNV = xpath.select1("MANV/text()", nhanVien).nodeValue;
    const tenV = xpath.select1("TENV/text()", nhanVien).nodeValue;
    console.log(`- Mã NV: ${maNV}, Tên: ${tenV}`);
}

// 3. Lấy tất cả tên món
result = getXPathResult("//MON/TENMON", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n3. Tất cả tên món:");
for (let i = 0; i < result.snapshotLength; i++) {
    console.log(result.snapshotItem(i).textContent);
}

// 4. Lấy tên nhân viên có mã NV02
result = getXPathResult("//NHANVIEN[MANV='NV02']/TENV", xmlDoc, xpath.XPathResult.FIRST_ORDERED_NODE_TYPE);
console.log("\n4. Tên nhân viên có mã NV02:", result.singleNodeValue ? result.singleNodeValue.textContent : "Not found");

// 5. Lấy tên và số điện thoại của nhân viên NV03
result = getXPathResult("//NHANVIEN[MANV='NV03']", xmlDoc, xpath.XPathResult.FIRST_ORDERED_NODE_TYPE);
console.log("\n5. Tên và số điện thoại của nhân viên NV03:");
if (result.singleNodeValue) {
    const nhanVien = result.singleNodeValue;
    const tenV = xpath.select1("TENV/text()", nhanVien).nodeValue;
    const sdt = xpath.select1("SDT/text()", nhanVien).nodeValue;
    console.log(`- Tên: ${tenV}, SĐT: ${sdt}`);
} else {
    console.log("Not found");
}

// 6. Lấy tên món có giá > 50,000
result = getXPathResult("//MON[GIA > 50000]/TENMON", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n6. Tên món có giá > 50,000:");
for (let i = 0; i < result.snapshotLength; i++) {
    console.log(result.snapshotItem(i).textContent);
}

// 7. Lấy số bàn của hóa đơn HD03
result = getXPathResult("//HOADON[SOHD='HD03']/SOBAN", xmlDoc, xpath.XPathResult.FIRST_ORDERED_NODE_TYPE);
console.log("\n7. Số bàn của hóa đơn HD03:", result.singleNodeValue ? result.singleNodeValue.textContent : "Not found");

// 8. Lấy tên món có mã M02
result = getXPathResult("//MON[MAMON='M02']/TENMON", xmlDoc, xpath.XPathResult.FIRST_ORDERED_NODE_TYPE);
console.log("\n8. Tên món có mã M02:", result.singleNodeValue ? result.singleNodeValue.textContent : "Not found");

// 9. Lấy ngày lập của hóa đơn HD03
result = getXPathResult("//HOADON[SOHD='HD03']/NGAYLAP", xmlDoc, xpath.XPathResult.FIRST_ORDERED_NODE_TYPE);
console.log("\n9. Ngày lập của hóa đơn HD03:", result.singleNodeValue ? result.singleNodeValue.textContent : "Not found");

// 10. Lấy tất cả mã món trong hóa đơn HD01
result = getXPathResult("//HOADON[SOHD='HD01']/CTHDS/CTHD/MAMON", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n10. Mã món trong hóa đơn HD01:");
for (let i = 0; i < result.snapshotLength; i++) {
    console.log(result.snapshotItem(i).textContent);
}

// 11. Lấy tên món trong hóa đơn HD01
result = getXPathResult("//HOADON[SOHD='HD01']/CTHDS/CTHD/MAMON", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n11. Tên món trong hóa đơn HD01:");
for (let i = 0; i < result.snapshotLength; i++) {
    const maMon = result.snapshotItem(i).textContent;
    const tenMon = xpath.select1(`//MON[MAMON='${maMon}']/TENMON`, xmlDoc).textContent;
    console.log(tenMon);
}

// 12. Lấy tên nhân viên lập hóa đơn HD02
result = getXPathResult("//HOADON[SOHD='HD02']/MANV", xmlDoc, xpath.XPathResult.FIRST_ORDERED_NODE_TYPE);
console.log("\n12. Tên nhân viên lập hóa đơn HD02:");
if (result.singleNodeValue) {
    const maNV = result.singleNodeValue.textContent;
    const tenV = xpath.select1(`//NHANVIEN[MANV='${maNV}']/TENV`, xmlDoc).textContent;
    console.log(tenV);
} else {
    console.log("Not found");
}

// 13. Đếm số bàn
result = getXPathResult("count(//BAN)", xmlDoc, xpath.XPathResult.NUMBER_TYPE);
console.log("\n13. Số bàn:", result.numberValue);

// 14. Đếm số hóa đơn lập bởi NV01
result = getXPathResult("count(//HOADON[MANV='NV01'])", xmlDoc, xpath.XPathResult.NUMBER_TYPE);
console.log("\n14. Số hóa đơn lập bởi NV01:", result.numberValue);

// 15. Lấy tên tất cả món có trong hóa đơn của bàn số 2
result = getXPathResult("//HOADON[SOBAN='2']/CTHDS/CTHD/MAMON", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n15. Tên món trong hóa đơn của bàn số 2:");
for (let i = 0; i < result.snapshotLength; i++) {
    const maMon = result.snapshotItem(i).textContent;
    const tenMon = xpath.select1(`//MON[MAMON='${maMon}']/TENMON`, xmlDoc).textContent;
    console.log(tenMon);
}

// 16. Lấy tất cả nhân viên từng lập hóa đơn cho bàn số 3
result = getXPathResult("//HOADON[SOBAN='3']/MANV", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n16. Nhân viên từng lập hóa đơn cho bàn số 3:");
for (let i = 0; i < result.snapshotLength; i++) {
    const maNV = result.snapshotItem(i).textContent;
    const tenV = xpath.select1(`//NHANVIEN[MANV='${maNV}']/TENV`, xmlDoc).textContent;
    console.log(`- ${tenV}`);
}

// 17. Lấy tất cả hóa đơn mà nhân viên nữ lập
const femaleEmployees = getXPathResult("//NHANVIEN[GIOITINH='Nữ']/MANV/text()", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
const femaleManvs = [];
for (let i = 0; i < femaleEmployees.snapshotLength; i++) {
    femaleManvs.push(femaleEmployees.snapshotItem(i).nodeValue);
}
result = getXPathResult(`//HOADON[MANV='${femaleManvs.join("' or MANV='")}']`, xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n17. Hóa đơn mà nhân viên nữ lập:");
for (let i = 0; i < result.snapshotLength; i++) {
    const hoaDon = result.snapshotItem(i);
    const soHD = xpath.select1("SOHD/text()", hoaDon).nodeValue;
    console.log(`- Số HD: ${soHD}`);
}

// 18. Lấy tất cả nhân viên từng phục vụ bàn số 1
result = getXPathResult("//HOADON[SOBAN='1']/MANV", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
console.log("\n18. Nhân viên từng phục vụ bàn số 1:");
for (let i = 0; i < result.snapshotLength; i++) {
    const maNV = result.snapshotItem(i).textContent;
    const tenV = xpath.select1(`//NHANVIEN[MANV='${maNV}']/TENV`, xmlDoc).textContent;
    console.log(`- ${tenV}`);
}

// 19. Lấy tất cả món được gọi nhiều hơn 1 lần trong các hóa đơn
const allMonItems = getXPathResult("//CTHD/MAMON/text()", xmlDoc, xpath.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
const monCounts = {};
for (let i = 0; i < allMonItems.snapshotLength; i++) {
    const maMon = allMonItems.snapshotItem(i).nodeValue;
    monCounts[maMon] = (monCounts[maMon] || 0) + 1;
}
console.log("\n19. Món được gọi nhiều hơn 1 lần:");
for (let maMon in monCounts) {
    if (monCounts[maMon] > 1) {
        const tenMon = xpath.select1(`//MON[MAMON='${maMon}']/TENMON`, xmlDoc).textContent;
        console.log(`- ${tenMon} (lần: ${monCounts[maMon]})`);
    }
}

// 20. Lấy tên bàn + ngày lập hóa đơn tương ứng SOHD='HD02'
result = getXPathResult("//HOADON[SOHD='HD02']", xmlDoc, xpath.XPathResult.FIRST_ORDERED_NODE_TYPE);
console.log("\n20. Tên bàn và ngày lập hóa đơn HD02:");
if (result.singleNodeValue) {
    const hoaDon = result.singleNodeValue;
    const soBan = xpath.select1("SOBAN/text()", hoaDon).nodeValue;
    const tenBan = xpath.select1(`//BAN[SOBAN='${soBan}']/TENBAN`, xmlDoc).textContent;
    const ngayLap = xpath.select1("NGAYLAP/text()", hoaDon).nodeValue;
    console.log(`- Tên bàn: ${tenBan}, Ngày lập: ${ngayLap}`);
} else {
    console.log("Not found");
}