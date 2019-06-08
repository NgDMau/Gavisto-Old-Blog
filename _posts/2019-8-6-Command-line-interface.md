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

Lệnh ssh mình dùng để truy cập là: `ssh ngdmau@infore.tigerwood.org -p 22000`.

Bây giờ mình dùng alias:
`alias infore='ssh ngdmau@infore.tigerwood.org -p 22000'`.

Xong, từ giờ thay vì nhập cả câu lệnh dài như trước, ta chỉ cần gõ lệnh `infore` trong terminal để truy cập máy chủ.

