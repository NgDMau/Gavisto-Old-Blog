---
layout: post
title: Command Line Interface (CLI) trên Linux và ứng dụng
---

Nếu là một người dùng Linux, chắc hẳn ai cũng ít nhiều biết đến giao diện dòng lệnh (CLI) của nó. Mặc dù các bản phân phối Linux hiện đại đã phát triển tới mức có thể làm mọi việc mà không cần đến CLI, tuy nhiên nếu biết cách sử dụng CLI thành thạo thì hiệu quả công việc có thể tăng rất nhiều.

**Giới thiệu khái quát về CLI**

Giao diện dòng lệnh (CLI) là một ứng dụng giúp con người giao tiếp với máy tính một cách dễ dàng hơn. Thời hoàng kim là khi các ứng dụng thao tác đồ họa chưa phát triển. Khi đó, người ta điều khiển máy tính bằng những dòng lệnh được gõ trong một cửa sổ nhỏ, đơn màu, thường gọi là **_terminal_**.

![_config.yml]({{ site.baseurl }}/images/cli_terminal_screenshot.png)

_Một cửa sổ terminal trên Ubuntu 18.04 LTS_

**Sử dụng CLI hiệu quả**

Với CLI, chúng ta có thể viết script chạy tự động hoặc sử dụng alias để thực thi các lệnh nhanh chóng. Ví dụ mình hay phải truy cập máy chủ bằng **_ssh_**, nên mình sẽ đặt alias cho nó.

Lệnh ssh mình dùng để truy cập là: 
`ssh ngdmau@infore.tigerwood.org -p 22000`.

Bây giờ mình dùng alias:
`alias infore='ssh ngdmau@infore.tigerwood.org -p 22000'`.

Xong, từ giờ thay vì nhập cả câu lệnh dài như trước, ta chỉ cần gõ lệnh `infore` trong terminal để truy cập máy chủ.

**Tạo một app CLI đơn giản**

Chắc các bạn còn nhớ ở seminar trước, mình có làm một tool nhỏ tìm cụm đầy đủ của một từ viết tắt dựa trên dữ liệu của Cốc Cốc ở **[đây](https://github.com/NgDMau/abbreviation)**.

Bây giờ mình sẽ hướng dẫn các bạn làm một ứng dụng có tên **whatis** trên **_terminal_** nhé. Mỗi khi gõ lệnh `whatis` kèm theo một từ viết tắt phía sau rồi enter thì kết quả nhận được sẽ là cụm từ đầy đủ của từ viết tắt đó.

![_config.yml]({{ site.baseurl }}/images/whatis_screenshot.png)

_Ảnh chụp màn hình của ứng dụng_

Trước hết ta tạo một thư mục ở home tên là **whatis**. Trong thư mục đó ta có 1 file _setup.py_ và _setup.cfg_, ngoài ra lại có một thư mục con cũng tên **_whatis_**.  
Ở trong _setup.py_, ta có:

`try:`
    `from setuptools import setup, find_packages`
`except ImportError:`
    `from distutils.core import setup, find_packages`

`setup(name='whatis',`
      `version='0.0',`
      `packages=find_packages(), #fix`
      `description='Sequential model-based optimization toolbox.')`

Bên trong _setup.cfg_ gồm metadata của ứng dụng:

`[metadata]`
`name = whatis`
`version = 1.0.0`
`author = Mau Dinh Nguyen`

`[options]`
`packages = find:`
`install_requires =`
    `click`
    `requests`

`[options.entry_points]`
`console_scripts =`
    `whatis = whatis.app:main`

Ở dòng cuối cùng, khi chạy lệnh whatis trên terminal, hàm main trong file app.py ở thư mục whatis sẽ được chạy.

Trong thư mục whatis con, ta tạo một file `__init__.py` và để trống. Sau đó tạo tiếp file _app.py_, bên trông như sau:

`import click`
`from .functions import whatis`
`@click.command()`
`@click.argument("acronyms")`

`def main(acronyms:str):`
    `whatis(acronyms)`

`if __name__ == '__main__':`
    `main(acronyms)`

Package **click** của python giúp ta định nghĩa argument và tạo hell, option một cách thuận tiện. Hàm chính hoạt động laf hàm main, nhưng nó lại gọi hàm whatis ở file [_functions.py_](https://github.com/NgDMau/whatis/blob/master/whatis/functions.py).

Ta cần tải file dữ liệu nữa là hoàn thành, file (acronyms.txt)[https://github.com/NgDMau/whatis/blob/master/whatis/acronyms.txt]. Đặt file này bên trong thư mục _whatis_ con.

Cuối cùng ta có cây dữ liệu như sau

whatis  
|_ whatis  
   |_ __init__.py  
   |_ app.py  
   |_ functions.py 
   |_ acronyms.txt 
 _ setup.cfg  
 _ setup.py  

Để cài đăt ứng dụng, ta dùng lệnh `python setup.py install`.  
Chúc các bạn vui vẻ!.

Tham khảo tại [kirachien's blog](https://chienkira.github.io/blog/posts/t%E1%BB%B1-t%E1%BA%A1o-ch%C6%B0%C6%A1ng-tr%C3%ACnh-cli-c%E1%BB%A7a-ch%C3%ADnh-m%C3%ACnh-kh%C3%B4ng-%C4%91%E1%BB%A5ng-h%C3%A0ng/).





