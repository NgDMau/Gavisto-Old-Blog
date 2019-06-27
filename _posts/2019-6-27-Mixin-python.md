---
layout: post
title: Mixin trong python
---

Một trong những tính năng thú vị ở python là tính đa thừa kế, tức là một class con có thể thừa kế các method từ nhiều hơn 1 class cha. Tính năng này gọi là **Mixin**.

Trước hết, ta tạo một class mô tả con mèo, tên là **catMixin**:  
```python
class catMixin(object):
    def climb(self):
        print("I can climb")
    def meow(self):
        print("Meow Meow")
```  
Ở đây ta thấy con mèo có thể trèo và kêu meo meo.
Lưu chỗ code trên vào file **catMixin.py** nhé.  
Tiếp theo ta tạo thêm class nữa đi, để mô tả con vịt, tên là **duckMixin**:  
```python
class duckMixin(object):
    def swim(self):
        print("I can swim")
    def oack(self):
        print("Oack Oack Oack")
```  
Chú vịt thì biết bơi và kêu oack oack.  
Rồi nhé, bây giờ ta tạo một chú chó lai vịt, bản chất nó là chó nhưng cũng có những method của vịt.  
```python
from duckMixin import duckMixin

class dogduck(duckMixin):
    def gouw(self):
        print("Gouw Gouw")
    def do_another_thing(self):
        self.oack()

if __name__ == "__main__":
    goodboy = dogduck()
    goodboy.gouw()
    goodboy.do_another_thing()
    goodboy.swim()
```  
Lưu đoạn code trên vào file **dogduck.py** nhé.  
Trên cửa sổ terminal gõ:  
```bash
python dogduck.py
```  
và output là:
```bash
Gouw Gouw
Oack Oack Oack
I can swim
```  
Tiếp tục, lần này ta mixin 2 class với nhau, ta tạo một con vật mới lai giữa mèo và vịt, tên là **catduck**:  
```python
from catMixin import catMixin
from duckMixin import duckMixin

class catduck(catMixin, duckMixin):
    def do_some_thing(self):
        print("I am a catduck")

if __name__ == "__main__":
    animal = catduck()
    animal.climb()
    animal.swim()
    animal.meow()
    animal.oack()
```  
Trên cửa sổ terminal gõ:  
```bash
python catduck.py
```  
output của ta là:  
```bash
I can climb
I can swim
Meow Meow
Oack Oack Oack
```  
Đó, để cho dễ nhìn thì những class được dùng để mixin ta nên thêm chữ Mixin ở cuối tên class cho dễ nhận ra. Một lưu ý nho nhỏ là nếu mixin nhiều class mà trong đó có 2 hay nhiều class có tên method giống nhau, thì tên của class nào trong argument được khai báo trước, python sẽ lấy method của class đó trước.  
Ví dụ **class CatMonkeyDog(catMixin, monkeyMixin, dogMixin)** thì thứ tự ưu tiên sẽ là CatMonkeyDog > catMixin > monkeyMixin > dogMixin. Nếu class **catMixin** và **monkeyMixin** đều có method **climb** thì method của **catMixin** sẽ được sử dụng.  
Cảm ơn và chúc các bạn vui vẻ.  