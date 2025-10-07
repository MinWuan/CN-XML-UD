from lxml import etree

# Đọc file XML từ hệ thống file
with open('sv.xml', 'r', encoding='utf-8') as file:
    xml_string = file.read()

# Phân tích XML thành DOM
xml_doc = etree.XML(xml_string)

# Hàm hỗ trợ để lấy kết quả XPath
def get_xpath_result(expression, context_node=xml_doc):
    return context_node.xpath(expression)

# 1. Lấy tất cả sinh viên (trích xuất thông tin id, tên và ngày sinh)
result = get_xpath_result("//student")
print("1. Tất cả sinh viên:")
for student in result:
    id_value = student.xpath("id/text()")[0]
    name = student.xpath("name/text()")[0]
    date = student.xpath("date/text()")[0]
    print(f"- ID: {id_value}, Tên: {name}, Ngày sinh: {date}")

# 2. Liệt kê tên tất cả sinh viên
result = get_xpath_result("//student/name/text()")
print("\n2. Tên tất cả sinh viên:")
for name in result:
    print(name)

# 3. Lấy tất cả id của sinh viên
result = get_xpath_result("//student/id/text()")
print("\n3. ID của tất cả sinh viên:")
for id_value in result:
    print(id_value)

# 4. Lấy ngày sinh của sinh viên có id = "SV01"
result = get_xpath_result("//student[id='SV01']/date/text()")
print("\n4. Ngày sinh của SV01:", result[0] if result else "Not found")

# 5. Lấy các khóa học
result = get_xpath_result("//enrollment/course/text()")
print("\n5. Các khóa học:")
for course in result:
    print(course)

# 6. Lấy toàn bộ thông tin của sinh viên đầu tiên (trích xuất thông tin)
result = get_xpath_result("/school/student[1]")
print("\n6. Toàn bộ thông tin của sinh viên đầu tiên:")
if result:
    student = result[0]
    id_value = student.xpath("id/text()")[0]
    name = student.xpath("name/text()")[0]
    date = student.xpath("date/text()")[0]
    print(f"- ID: {id_value}, Tên: {name}, Ngày sinh: {date}")
else:
    print("Not found")

# 7. Lấy mã sinh viên đăng ký khóa học "Vatly203"
result = get_xpath_result("//enrollment[course='Vatly203']/studentRef/text()")
print("\n7. Mã sinh viên đăng ký khóa học Vatly203:")
for student_ref in result:
    print(student_ref)

# 8. Lấy tên sinh viên học môn "Toan101"
result = get_xpath_result("//enrollment[course='Toan101']/preceding::student[1]/name/text()")
print("\n8. Tên sinh viên học môn Toan101:", result[0] if result else "Not found")

# 9. Lấy tên sinh viên học môn "Vatly203"
result = get_xpath_result("//enrollment[course='Vatly203']/preceding::student[1]/name/text()")
print("\n9. Tên sinh viên học môn Vatly203:")
for name in result:
    print(name)

# 10. Lấy ngày sinh của sinh viên có id="SV01"
result = get_xpath_result("//student[id='SV01']/date/text()")
print("\n10. Ngày sinh của SV01:", result[0] if result else "Not found")

# 11. Lấy tên và ngày sinh của mọi sinh viên sinh năm 1997
result = get_xpath_result("//student[substring(date, 1, 4)='1997']")
print("\n11. Tên và ngày sinh của sinh viên sinh năm 1997:")
for student in result:
    name = student.xpath("name/text()")[0]
    date = student.xpath("date/text()")[0]
    print(f"- Tên: {name}, Ngày sinh: {date}")

# 12. Lấy tên của các sinh viên có ngày sinh trước năm 1998
result = get_xpath_result("//student[substring(date, 1, 4) < '1998']/name/text()")
print("\n12. Tên của các sinh viên có ngày sinh trước năm 1998:")
for name in result:
    print(name)

# 13. Đếm tổng số sinh viên
result = get_xpath_result("count(//student)")
print("\n13. Tổng số sinh viên:", int(result))

# 14. Lấy tất cả sinh viên chưa đăng ký môn nào (trích xuất thông tin)
# Lưu ý: XPath đơn giản không hỗ trợ so sánh trực tiếp như JavaScript, cần xử lý thủ công
all_students = get_xpath_result("//student")
enrolled_ids = get_xpath_result("//enrollment/studentRef/text()")
print("\n14. Sinh viên chưa đăng ký môn nào:")
for student in all_students:
    id_value = student.xpath("id/text()")[0]
    if id_value not in enrolled_ids:
        name = student.xpath("name/text()")[0]
        date = student.xpath("date/text()")[0]
        print(f"- ID: {id_value}, Tên: {name}, Ngày sinh: {date}")

# 15. Lấy phần tử <date> anh em ngay sau <name> của SV01
result = get_xpath_result("//student[id='SV01']/name/following-sibling::date[1]/text()")
print("\n15. Phần tử <date> anh em ngay sau <name> của SV01:", result[0] if result else "Not found")

# 16. Lấy phần tử <id> anh em ngay trước <name> của SV02
result = get_xpath_result("//student[id='SV02']/name/preceding-sibling::id[1]/text()")
print("\n16. Phần tử <id> anh em ngay trước <name> của SV02:", result[0] if result else "Not found")

# 17. Lấy toàn bộ node <course> trong cùng một <enrollment> với studentRef='SV03'
result = get_xpath_result("//enrollment[studentRef='SV03']/course/text()")
print("\n17. Node <course> trong enrollment với studentRef='SV03':")
for course in result:
    print(course)

# 18. Lấy sinh viên có họ là “Trần” (không có trong file mới, bỏ qua)
result = get_xpath_result("//student[starts-with(name, 'Trần')]")
print("\n18. Sinh viên có họ là Trần:")
for student in result:
    name = student.xpath("name/text()")[0]
    date = student.xpath("date/text()")[0]
    print(f"- Tên: {name}, Ngày sinh: {date}")

# 19. Lấy năm sinh của sinh viên SV01
result = get_xpath_result("substring(//student[id='SV01']/date, 1, 4)")
print("\n19. Năm sinh của SV01:", result[0] if result else "Not found")