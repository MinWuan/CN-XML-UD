import mysql.connector
from lxml import etree

# Đường dẫn tệp (chỉnh sửa nếu cần)
xml_file = 'catalog.xml'  # Tệp XML được cung cấp bởi nhà cung cấp
xsd_file = 'catalog.xsd'  # Tệp XSD bạn đã thiết kế

# Bước 1: Phân tích cú pháp XSD và tạo đối tượng XMLSchema
try:
    schema_root = etree.parse(xsd_file)
    schema = etree.XMLSchema(schema_root)
except etree.XMLSchemaParseError as e:
    print(f"Lỗi khi phân tích XSD: {e}")
    exit(1)

# Bước 2: Phân tích cú pháp XML
try:
    xml_root = etree.parse(xml_file)
except etree.XMLSyntaxError as e:
    print(f"Lỗi khi phân tích XML: {e}")
    exit(1)

# Bước 3: Kiểm tra tính hợp lệ của XML so với XSD
try:
    schema.assertValid(xml_root)
    print("XML hợp lệ so với XSD.")
except etree.DocumentInvalid as e:
    print(f"XML không hợp lệ: {e}")
    exit(1)

# Bước 4: Kết nối tới MySQL (thay bằng thông tin đăng nhập thực tế của bạn)
try:
    db = mysql.connector.connect(
        host="localhost", 
        user="root",  
        password="123456",
        database="test"  
    )
    cursor = db.cursor()
    print("Kết nối tới MySQL thành công.")
except mysql.connector.Error as e:
    print(f"Lỗi khi kết nối tới MySQL: {e}")
    exit(1)

# Bước 5: Tạo bảng nếu chưa tồn tại
cursor.execute("""
    CREATE TABLE IF NOT EXISTS Categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    )
""")

cursor.execute("""
    CREATE TABLE IF NOT EXISTS Products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(10) NOT NULL,
        stock INT NOT NULL,
        category_id VARCHAR(50) NOT NULL,
        FOREIGN KEY (category_id) REFERENCES Categories(id)
    )
""")
print("Bảng đã được tạo hoặc đã tồn tại.")

# Bước 6: Sử dụng XPath để trích xuất dữ liệu và chèn/cập nhật vào MySQL

# Trích xuất và chèn/cập nhật danh mục (categories)
categories = xml_root.xpath('//categories/category')
for cat in categories:
    cat_id = cat.attrib['id']
    cat_name = cat.text.strip() if cat.text else ''
    cursor.execute("""
        INSERT INTO Categories (id, name)
        VALUES (%s, %s)
        ON DUPLICATE KEY UPDATE name = %s
    """, (cat_id, cat_name, cat_name))

# Trích xuất và chèn/cập nhật sản phẩm (products)
products = xml_root.xpath('//products/product')
for prod in products:
    prod_id = prod.attrib['id']
    category_ref = prod.attrib['categoryRef']
    name = prod.find('name').text.strip() if prod.find('name').text else ''
    price_elem = prod.find('price')
    price = float(price_elem.text) if price_elem.text else 0.0
    currency = price_elem.attrib['currency']
    stock = int(prod.find('stock').text) if prod.find('stock').text else 0
    
    cursor.execute("""
        INSERT INTO Products (id, name, price, currency, stock, category_id)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            name = %s,
            price = %s,
            currency = %s,
            stock = %s,
            category_id = %s
    """, (prod_id, name, price, currency, stock, category_ref,
          name, price, currency, stock, category_ref))

# Lưu thay đổi và đóng kết nối
db.commit()
print(f"Đã chèn/cập nhật {len(categories)} danh mục và {len(products)} sản phẩm.")
db.close()