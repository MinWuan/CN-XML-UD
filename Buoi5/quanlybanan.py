from lxml import etree

# Đọc file XML từ hệ thống file
with open('quanlybanan.xml', 'r', encoding='utf-8') as file:
    xml_string = file.read()

# Phân tích XML thành DOM
xml_doc = etree.XML(xml_string)

# Hàm hỗ trợ để lấy kết quả XPath
def get_xpath_result(expression, context_node=xml_doc):
    return context_node.xpath(expression)

# 1. Lấy tất cả bàn
result = get_xpath_result("//BAN")
print("1. Tất cả bàn:")
for ban in result:
    so_ban = ban.xpath("SOBAN/text()")[0]
    ten_ban = ban.xpath("TENBAN/text()")[0]
    print(f"- Số bàn: {so_ban}, Tên bàn: {ten_ban}")

# 2. Lấy tất cả nhân viên
result = get_xpath_result("//NHANVIEN")
print("\n2. Tất cả nhân viên:")
for nhan_vien in result:
    ma_nv = nhan_vien.xpath("MANV/text()")[0]
    ten_v = nhan_vien.xpath("TENV/text()")[0]
    print(f"- Mã NV: {ma_nv}, Tên: {ten_v}")

# 3. Lấy tất cả tên món
result = get_xpath_result("//MON/TENMON/text()")
print("\n3. Tất cả tên món:")
for ten_mon in result:
    print(ten_mon)

# 4. Lấy tên nhân viên có mã NV02
result = get_xpath_result("//NHANVIEN[MANV='NV02']/TENV/text()")
print("\n4. Tên nhân viên có mã NV02:", result[0] if result else "Not found")

# 5. Lấy tên và số điện thoại của nhân viên NV03
result = get_xpath_result("//NHANVIEN[MANV='NV03']")
print("\n5. Tên và số điện thoại của nhân viên NV03:")
if result:
    nhan_vien = result[0]
    ten_v = nhan_vien.xpath("TENV/text()")[0]
    sdt = nhan_vien.xpath("SDT/text()")[0]
    print(f"- Tên: {ten_v}, SĐT: {sdt}")
else:
    print("Not found")

# 6. Lấy tên món có giá > 50,000
result = get_xpath_result("//MON[GIA > 50000]/TENMON/text()")
print("\n6. Tên món có giá > 50,000:")
for ten_mon in result:
    print(ten_mon)

# 7. Lấy số bàn của hóa đơn HD03
result = get_xpath_result("//HOADON[SOHD='HD03']/SOBAN/text()")
print("\n7. Số bàn của hóa đơn HD03:", result[0] if result else "Not found")

# 8. Lấy tên món có mã M02
result = get_xpath_result("//MON[MAMON='M02']/TENMON/text()")
print("\n8. Tên món có mã M02:", result[0] if result else "Not found")

# 9. Lấy ngày lập của hóa đơn HD03
result = get_xpath_result("//HOADON[SOHD='HD03']/NGAYLAP/text()")
print("\n9. Ngày lập của hóa đơn HD03:", result[0] if result else "Not found")

# 10. Lấy tất cả mã món trong hóa đơn HD01
result = get_xpath_result("//HOADON[SOHD='HD01']/CTHDS/CTHD/MAMON/text()")
print("\n10. Mã món trong hóa đơn HD01:")
for ma_mon in result:
    print(ma_mon)

# 11. Lấy tên món trong hóa đơn HD01
result = get_xpath_result("//HOADON[SOHD='HD01']/CTHDS/CTHD/MAMON/text()")
print("\n11. Tên món trong hóa đơn HD01:")
for ma_mon in result:
    ten_mon = xml_doc.xpath(f"//MON[MAMON='{ma_mon}']/TENMON/text()")[0]
    print(ten_mon)

# 12. Lấy tên nhân viên lập hóa đơn HD02
result = get_xpath_result("//HOADON[SOHD='HD02']/MANV/text()")
print("\n12. Tên nhân viên lập hóa đơn HD02:")
if result:
    ma_nv = result[0]
    ten_v = xml_doc.xpath(f"//NHANVIEN[MANV='{ma_nv}']/TENV/text()")[0]
    print(ten_v)
else:
    print("Not found")

# 13. Đếm số bàn
result = get_xpath_result("count(//BAN)")
print("\n13. Số bàn:", int(result))

# 14. Đếm số hóa đơn lập bởi NV01
result = get_xpath_result("count(//HOADON[MANV='NV01'])")
print("\n14. Số hóa đơn lập bởi NV01:", int(result))

# 15. Lấy tên tất cả món có trong hóa đơn của bàn số 2
result = get_xpath_result("//HOADON[SOBAN='2']/CTHDS/CTHD/MAMON/text()")
print("\n15. Tên món trong hóa đơn của bàn số 2:")
for ma_mon in result:
    ten_mon = xml_doc.xpath(f"//MON[MAMON='{ma_mon}']/TENMON/text()")[0]
    print(ten_mon)

# 16. Lấy tất cả nhân viên từng lập hóa đơn cho bàn số 3
result = get_xpath_result("//HOADON[SOBAN='3']/MANV/text()")
print("\n16. Nhân viên từng lập hóa đơn cho bàn số 3:")
for ma_nv in result:
    ten_v = xml_doc.xpath(f"//NHANVIEN[MANV='{ma_nv}']/TENV/text()")[0]
    print(f"- {ten_v}")

# 17. Lấy tất cả hóa đơn mà nhân viên nữ lập
female_manvs = get_xpath_result("//NHANVIEN[GIOITINH='Nữ']/MANV/text()")
result = get_xpath_result(f"//HOADON[MANV='{''.join(female_manvs)}' or MANV='{''.join(female_manvs[1:])}']")
print("\n17. Hóa đơn mà nhân viên nữ lập:")
for hoa_don in result:
    so_hd = hoa_don.xpath("SOHD/text()")[0]
    print(f"- Số HD: {so_hd}")

# 18. Lấy tất cả nhân viên từng phục vụ bàn số 1
result = get_xpath_result("//HOADON[SOBAN='1']/MANV/text()")
print("\n18. Nhân viên từng phục vụ bàn số 1:")
for ma_nv in result:
    ten_v = xml_doc.xpath(f"//NHANVIEN[MANV='{ma_nv}']/TENV/text()")[0]
    print(f"- {ten_v}")

# 19. Lấy tất cả món được gọi nhiều hơn 1 lần trong các hóa đơn
all_mon_items = get_xpath_result("//CTHD/MAMON/text()")
mon_counts = {}
for ma_mon in all_mon_items:
    mon_counts[ma_mon] = mon_counts.get(ma_mon, 0) + 1
print("\n19. Món được gọi nhiều hơn 1 lần:")
for ma_mon, count in mon_counts.items():
    if count > 1:
        ten_mon = xml_doc.xpath(f"//MON[MAMON='{ma_mon}']/TENMON/text()")[0]
        print(f"- {ten_mon} (lần: {count})")

# 20. Lấy tên bàn + ngày lập hóa đơn tương ứng SOHD='HD02'
result = get_xpath_result("//HOADON[SOHD='HD02']")
print("\n20. Tên bàn và ngày lập hóa đơn HD02:")
if result:
    hoa_don = result[0]
    so_ban = hoa_don.xpath("SOBAN/text()")[0]
    ten_ban = xml_doc.xpath(f"//BAN[SOBAN='{so_ban}']/TENBAN/text()")[0]
    ngay_lap = hoa_don.xpath("NGAYLAP/text()")[0]
    print(f"- Tên bàn: {ten_ban}, Ngày lập: {ngay_lap}")
else:
    print("Not found")