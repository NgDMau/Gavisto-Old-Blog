---
layout: post
title: Art of Vector Representation of Words
---

Việc sáng tạo ra các ngôn ngữ để diễn đạt tâm tư, ý nghĩ về một sự vật, sự việc nào đó là một bước đột phát lớn trong lịch sử loài người. Nó là tiền đề cho tiến hóa vượt bậc của nhân loại sau này. Tuy nhiên trên thực tế, dù đã trải qua hàng ngàn năm phát triển, vẫn có nhiều trường hợp các ngôn ngữ trở nên không rõ ràng, khó diễn đạt. Ta có ví dụ sau trong tiếng Anh:

    _"Việt rất yêu bạn gái anh ấy, Nam cũng thế"._

Rốt cuộc Nam yêu bạn gái mình hay bạn gái của Việt? Ở đây ta bắt gặp sự khó hiểu ở cách diễn đạt ngôn ngữ, ngay cả với trình độ của một người trưởng thành. Câu hỏi được đặt ra là làm sao để biểu diễn ngôn ngữ của con người ở một mức độ để máy tính có thể hiểu được?

Trong bài này, chúng ta sẽ đi tìm hiểu các phương pháp biểu diễn ngôn ngữ của con người dưới dạng mà máy tính có thể hiểu được, cùng với đó là ưu nhược điểm của từng loại phương pháp. Bài viết khá dài và có xuất hiện các công thức toán, nhưng không hề phức tạp đâu, mình đảm bảo!

Chúng ta đều biết ngôn ngữ của máy tính là những con số, trong khi của con người là tổ hợp của nhũng ký tự chữ cái. Chính vì vậy, phải có một cách chuyển đổi nào đó để đưa những ký tự chữ cái về các con số (hoặc một tập các con số). Những cách chuyển đổi như vậy được gọi là vector-hóa (vectorization).Ta sẽ lần lượt khám phá các phương pháp vectorization từ cổ điển nhất đến nâng cao nhất:

1. Biểu diễn one-hot (One-hot representations)
2. Biểu diễn rời rạc (Distributed representations)
3. Phân tích giá trị suy biến (Singular Value Decomposition)
4. Mô hình CBOW (Continous Big of Words)
5. Mô hình Skip-gram (Skip-gram model)
6. Biểu diễn Glove (Glove representations)

**One-hot representation**
Cho trước một tập từ vựng gồm V từ, có thứ tự (V là số tự nhiên)/ Lấy ví dụ tập A = [human, machine, interface, if, computer, applications, opinion, system, learn, science, time] gồm 11 từ, khi đó từ "interface" sẽ được biểu diễn dưới dạng vector [0 0 1 0 0 0 0 0 0 0 0]. Một vector gồm V-1 giá trị 0 và chỉ giá trị 1 duy nhất tại vị trí tương ứng với vị trí của nó trong tập từ, rất đơn giản đúng không? Tuy nhiên cái đơn giản này lại dẫn đến sự phức tạp, khi mà tập từ vựng quá lớn thì mỗi vector dài bằng với độ dài của tập từ, việc này khiến cho quá trình tính toán tốn rất nhiều tài nguyên. Hơn nữa việc chỉ có một giá trị duy nhất khác 0 khiến cho sử dụng các hàm similarity trở nên khó khăn. Ta gần như không lấy được thông tin gì nếu chỉ dùng những vector dạng này.

**Distributed representations**
Ý tưởng của phương pháp này dựa trên khái niệm "co-occurence". Ta tính số lần một từ xuất hiện trong cùng một ngữ cảnh với từ khác, với các ngữ cảnh gần nhau một khoảng k (k là số tự nhiên).

Lấy ví dụ đoạn văn bản sau:

_"Human machine interface for computer applications"_
_"User opinion of computer system response time"_
_"User interface management system"_
_"System engineering for improved response time"_

Ta có ma trận co-occurence như sau:
![_config.yml]({{ site.baseurl }}/images/coocurence_.png)

Từ "system" có mặt ở trong 2 ngữ cảnh (và 2 ngữ cảnh này cạnh nhau, nếu giữa chúng có 2 ngữ cảnh khác thì k = 3 và một trong 2 phải bị loại) với từ "user" nên giá trị tại [system][user] = [user][system] = 2. Mỗi hàng (hoặc cột) trong ma trận trên sẽ là vector tương ứng với mỗi từ đầu hàng hoặc đầu cột đó.
Tuy nhiên một điều cần lưu ý là có những từ lặp lại với số lần không nhỏ nhưng mang ít ý nghĩa, ví dụ: for, of,... Từ đây ta lại sinh ra khái niệm Positive Pointwise Mutual Information (PPMI). PPMI sẽ giúp ta quan tâm đến việc một từ xuất hiện trong cùng một ngữ cảnh với từ khác có quá quan trọng hay không.

![_config.yml]({{ site.baseurl }}/images/ppmi.png)

Từ đây chúng ta đã có bước đầu mang ngữ cảnh vào vector, một thông tin thú vị, tuy nhiên chưa thật sự tối ưu. Ví dụ từ "cat" và "dog" nằm ở các ngữ cảnh quá xa nhau (lớn hơn k) thì độ liên quan của chúng dĩ nhiên sẽ giảm bớt. Hơn nữa, ta vẫn chưa giảm được số chiều của một vector nên khối lượng tính toán vẫn rất nặng nề. 

**Singular value Decomposition**
